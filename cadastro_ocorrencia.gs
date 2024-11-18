// FRONTEND: Conecta o formulário HTML ao backend usando a URL do Apps Script

const WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbxJpT_BuyMWj8zyRcKRM4C1e1XTLVCVvhQLb7jut-a3k4bc1tBHCXcCEHaUSp55VwFT/exec';

document.getElementById('ocorrenciaForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const form = e.target;

  // Coleta os dados do formulário
  const formData = {
    nomeAluno: form.nomeAluno.value,
    anoSerie: form.anoSerie.value,
    professor: form.professor.value,
    ra: form.ra.value,
    disciplina: form.disciplina.value,
    descricaoOcorrencia: form.descricaoOcorrencia.value,
    numeroWhatsApp: form.numeroWhatsApp.value,
    dataRegistro: form.dataRegistro.value,
    dataRetorno: form.dataRetorno ? form.dataRetorno.value : '',
    descricao: form.descricao.value,
  };

  // Envia os dados para o backend
  fetch(WEB_APP_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        alert('Cadastro realizado com sucesso!');
      } else {
        alert('Erro ao cadastrar: ' + data.error);
      }
    })
    .catch((error) => {
      console.error('Erro:', error);
      alert('Erro ao enviar os dados. Verifique sua conexão com a internet.');
    });
});

document.getElementById('fotoInput').addEventListener('change', function (e) {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      document.getElementById('fotoAluno').src = e.target.result;
      document.getElementById('fotoAluno').style.display = 'block';
    };
    reader.readAsDataURL(file);
  }
});

document.getElementById('descricaoOcorrencia').addEventListener('change', function (e) {
  const dataRetornoGroup = document.getElementById('dataRetornoGroup');
  if (e.target.value === 'SUSPENSÃO') {
    dataRetornoGroup.style.display = 'flex';
  } else {
    dataRetornoGroup.style.display = 'none';
  }
});

// BACKEND: Código para o Google Apps Script

function doGet() {
  return HtmlService.createHtmlOutputFromFile('Index')
    .setTitle('2024_Cadastro_de_Ocorrencias');
}

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);

    const nomeAluno = data.nomeAluno;
    const anoSerie = data.anoSerie;
    const professor = data.professor;
    const ra = data.ra;
    const disciplina = data.disciplina;
    const descricaoOcorrencia = data.descricaoOcorrencia;
    const numeroWhatsApp = data.numeroWhatsApp;
    const dataRegistro = data.dataRegistro;
    const dataRetorno = data.dataRetorno || '';
    const descricao = data.descricao;

    cadastrarOcorrenciaEEnviarDocumento(
      nomeAluno,
      anoSerie,
      professor,
      ra,
      disciplina,
      descricaoOcorrencia,
      numeroWhatsApp,
      dataRegistro,
      dataRetorno,
      descricao
    );

    return ContentService.createTextOutput(
      JSON.stringify({ success: true })
    ).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(
      JSON.stringify({ success: false, error: error.message })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

function cadastrarOcorrenciaEEnviarDocumento(nomeAluno, serie, professor, ra, disciplina, descricaoOcorrencia, numeroWhatsApp, dataRegistro, dataRetorno, descricao) {
  const ss = SpreadsheetApp.openById('1u7qMsMHkZT47OZdar5qvshQDRA8XJrLgDjAZVOViAio');
  const ssCadastro = ss.getSheetByName('cadastro');
  const ssBancoDeAlunos = ss.getSheetByName('BANCODEALUNOS');

  if (!ssCadastro || !ssBancoDeAlunos) {
    throw new Error("Planilhas 'cadastro' ou 'BANCODEALUNOS' não encontradas.");
  }

  ssBancoDeAlunos.insertRowBefore(3);
  const linhaInsercao = 3;

  ssBancoDeAlunos.getRange(linhaInsercao, 1, 1, 9).setValues([
    [
      nomeAluno,
      serie,
      professor,
      ra,
      disciplina,
      Utilities.formatDate(new Date(dataRegistro), "GMT-03:00", "dd/MM/yyyy"),
      descricao,
      '',
      descricaoOcorrencia === 'SUSPENSÃO'
        ? Utilities.formatDate(new Date(dataRetorno), "GMT-03:00", "dd/MM/yyyy")
        : ''
    ]
  ]);

  const pdfUrl = criarDocumento(
    nomeAluno,
    serie,
    professor,
    ra,
    disciplina,
    descricao,
    new Date(dataRegistro),
    descricaoOcorrencia,
    descricaoOcorrencia === 'OCORRÊNCIA',
    descricaoOcorrencia === 'SUSPENSÃO',
    descricaoOcorrencia === 'SUSPENSÃO' ? new Date(dataRetorno) : null
  );

  ssBancoDeAlunos.getRange(linhaInsercao, 8).setValue(pdfUrl);

  if (numeroWhatsApp) {
    enviarMensagemWhatsApp(
      numeroWhatsApp,
      `Documento de ${descricaoOcorrencia} gerado para ${nomeAluno}.`,
      pdfUrl
    );
  }
}

function criarDocumento(nomeAluno, serie, professor, ra, disciplina, descricao, data, descricaoOcorrencia, ocorrenciaSelecionada, suspensaoSelecionada, dataRetornoSuspensao) {
  const pastaDestino = DriveApp.getFolderById("19JydmuXDW3ZA8ckj9N7tCjlDnEUozYxv");
  const idTemplate = '1dHwyN8mlb_4bltEksnoc3Yx5wUcDNgAkzqsluLPYeP8';
  const nomeArquivo = `${nomeAluno} - ${suspensaoSelecionada ? 'Suspensão' : 'Ocorrência'}`;

  const modelo = DriveApp.getFileById(idTemplate);
  const novoArquivo = modelo.makeCopy(nomeArquivo, pastaDestino);
  const novoDoc = DocumentApp.openById(novoArquivo.getId());
  const docCorpo = novoDoc.getBody();

  docCorpo.replaceText("{NOME}", nomeAluno);
  docCorpo.replaceText("{SÉRIE}", serie);
  docCorpo.replaceText("{PROFESSOR}", professor);
  docCorpo.replaceText("{RA}", ra);
  docCorpo.replaceText("{DISCIPLINA}", disciplina);
  docCorpo.replaceText("{DATA}", Utilities.formatDate(data, "GMT-03:00", "dd/MM/yyyy HH:mm:ss"));
  docCorpo.replaceText("{DESCRIÇÃO}", descricao);
  if (suspensaoSelecionada) {
    docCorpo.replaceText("{DATA_RETORNO_SUSPENSAO}", Utilities.formatDate(dataRetornoSuspensao, "GMT-03:00", "dd/MM/yyyy"));
  }

  novoDoc.saveAndClose();
  const pdfBlob = novoArquivo.getAs(MimeType.PDF);
  const pdfFile = pastaDestino.createFile(pdfBlob);
  const pdfUrl = pdfFile.getUrl();

  DriveApp.getFileById(novoArquivo.getId()).setTrashed(true);

  return pdfUrl;
}

function enviarMensagemWhatsApp(numero, mensagem, urlPdf) {
  const accountSid = 'YOUR_ACCOUNT_SID';
  const authToken = 'YOUR_AUTH_TOKEN';
  const fromNumber = 'whatsapp:+14155238886';

  const payload = {
    From: fromNumber,
    To: `whatsapp:${numero}`,
    Body: `${mensagem}\n${urlPdf}`
  };

  const options = {
    method: 'post',
    headers: {
      Authorization: `Basic ${Utilities.base64Encode(accountSid + ':' + authToken)}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    payload
  };

  UrlFetchApp.fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`, options);
}
