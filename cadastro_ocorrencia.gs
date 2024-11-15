function doGet() {
  var htmlOutput = HtmlService.createHtmlOutputFromFile('Index')
      .setTitle('2024_Cadastro_de_Ocorrencias');
  return htmlOutput;
}

function cadastrarOcorrenciaEEnviarDocumento() {
  var ss = SpreadsheetApp.openById('1u7qMsMHkZT47OZdar5qvshQDRA8XJrLgDjAZVOViAio');
  var ssCadastro = ss.getSheetByName('cadastro');
  if (!ssCadastro) {
    SpreadsheetApp.getUi().alert("Planilha 'cadastro' não encontrada.");
    return;
  }

  var nomeAluno = ssCadastro.getRange('C3').getValue();
  var serie = ssCadastro.getRange('C5').getValue();
  var professor = ssCadastro.getRange('C7').getValue();
  var ra = ssCadastro.getRange('C9').getValue();
  var descricao = ssCadastro.getRange('C16').getValue();
  var disciplina = ssCadastro.getRange('C11').getValue();
  var dataAtual = new Date();

  var ssBancoDeAlunos = ss.getSheetByName('BANCODEALUNOS');
  if (!ssBancoDeAlunos) {
    SpreadsheetApp.getUi().alert("Planilha 'BANCODEALUNOS' não encontrada.");
    return;
  }

  ssBancoDeAlunos.insertRowBefore(3);
  var linhaInsercao = 3;

  ssBancoDeAlunos.getRange(linhaInsercao, 1, 1, 9).setValues([[nomeAluno, serie, professor, ra, disciplina, Utilities.formatDate(dataAtual, "GMT-03:00", "dd/MM/yyyy HH:mm:ss"), descricao, '', '']]);

  var linhaFormatacao = ssBancoDeAlunos.getLastRow() % 2 === 0 ? 4 : 3;
  var rangeFormat = ssBancoDeAlunos.getRange(linhaFormatacao, 1, 1, 9);
  var rangeNewRow = ssBancoDeAlunos.getRange(linhaInsercao, 1, 1, 9);
  rangeFormat.copyTo(rangeNewRow, SpreadsheetApp.CopyPasteType.PASTE_FORMAT, false);

  var descricaoOcorrencia = ssCadastro.getRange('F11').getValue();
  var ocorrenciaSelecionada = descricaoOcorrencia === "OCORRÊNCIA";
  var suspensaoSelecionada = descricaoOcorrencia === "SUSPENSÃO";
  var dataRetornoSuspensao = ssCadastro.getRange('F13').getValue();

  if (typeof dataRetornoSuspensao === 'string' && dataRetornoSuspensao.trim() !== '') {
    var partesData = dataRetornoSuspensao.split('/');
    if (partesData.length === 3) {
      var ano = parseInt(partesData[2], 10);
      var mes = parseInt(partesData[1], 10) - 1;
      var dia = parseInt(partesData[0], 10);
      dataRetornoSuspensao = new Date(ano, mes, dia);
    } else {
      SpreadsheetApp.getUi().alert("Formato de data de retorno inválido.");
      return;
    }
  }

  var pdfUrl = criarDocumento(nomeAluno, serie, professor, ra, disciplina, descricao, dataAtual, descricaoOcorrencia, ocorrenciaSelecionada, suspensaoSelecionada, dataRetornoSuspensao);
  ssBancoDeAlunos.getRange(linhaInsercao, 8).setValue(pdfUrl);
  if (suspensaoSelecionada) {
    ssBancoDeAlunos.getRange(linhaInsercao, 9).setValue(Utilities.formatDate(dataRetornoSuspensao, "GMT-03:00", "dd/MM/yyyy"));
  }

  // Obter o número de telefone do responsável pelo aluno (assumindo que o número está na célula G7)
  var numeroWhatsApp = ssCadastro.getRange('G7').getValue();
  Logger.log('Número WhatsApp antes de ajustes: ' + numeroWhatsApp);
  if (numeroWhatsApp) {
    numeroWhatsApp = String(numeroWhatsApp).replace(/\s+/g, '');
    // Adicionar "+" ao número se não estiver presente
    if (numeroWhatsApp.charAt(0) !== '+') {
      numeroWhatsApp = '+' + numeroWhatsApp;
    }
    Logger.log('Número WhatsApp após ajustes: ' + numeroWhatsApp);

    var mensagem = "Documento de " + (ocorrenciaSelecionada ? "ocorrência" : "suspensão") + " para " + nomeAluno;
    enviarMensagemWhatsApp(numeroWhatsApp, mensagem, pdfUrl);
  } else {
    Logger.log('Número WhatsApp não encontrado na célula G7.');
  }

  SpreadsheetApp.getUi().alert("CADASTRO REALIZADO.");
}

function criarDocumento(nomeAluno, serie, professor, ra, disciplina, descricao, data, descricaoOcorrencia, ocorrenciaSelecionada, suspensaoSelecionada, dataRetornoSuspensao) {
  var pastaDestino = DriveApp.getFolderById("19JydmuXDW3ZA8ckj9N7tCjlDnEUozYxv");
  var idTemplate = '1dHwyN8mlb_4bltEksnoc3Yx5wUcDNgAkzqsluLPYeP8';
  var nomeArquivo = nomeAluno + ' - ' + (suspensaoSelecionada ? 'Suspensão' : 'Ocorrência');

  var modelo = DriveApp.getFileById(idTemplate);
  var novoArquivo = modelo.makeCopy(nomeArquivo, pastaDestino);
  var novoDoc = DocumentApp.openById(novoArquivo.getId());
  var docCorpo = novoDoc.getBody();

  var textoDocumento = docCorpo.getText()
    .replace("{NOME}", nomeAluno)
    .replace("{SÉRIE}", serie)
    .replace("{PROFESSOR}", professor)
    .replace("{RA}", ra)
    .replace("{DISCIPLINA}", disciplina)
    .replace("{DATA}", Utilities.formatDate(data, "GMT-03:00", "dd/MM/yyyy HH:mm:ss"))
    .replace("{OCORRÊNCIA}", ocorrenciaSelecionada ? "OCORRÊNCIA" : "")
    .replace("{SUSPENSÃO}", suspensaoSelecionada ? "SUSPENSÃO" : "")
    .replace("{DESCRIÇÃO}", descricao)
    .replace("{DATA_RETORNO_SUSPENSAO}", suspensaoSelecionada ? Utilities.formatDate(dataRetornoSuspensao, "GMT-03:00", "dd/MM/yyyy") : "")
    .replace("{RETORNO}", suspensaoSelecionada ? "O aluno deverá retornar em " + Utilities.formatDate(dataRetornoSuspensao, "GMT-03:00", "dd/MM/yyyy") : "");

  docCorpo.setText(textoDocumento);
  novoDoc.saveAndClose();

  var pdfBlob = novoArquivo.getAs(MimeType.PDF);
  var pdfFile = pastaDestino.createFile(pdfBlob);
  var pdfUrl = pdfFile.getUrl();

  DriveApp.getFileById(novoArquivo.getId()).setTrashed(true);

  return pdfUrl;
}

function enviarMensagemWhatsApp(numero, mensagem, urlPdf) {
  var assinatura = "\n\nEnviado pela E.E. LYDIA KITZ MOREIRA";

  var accountSid = 'AC32ec5095581b482f30dd3bd5398b3847';  // Substitua pelo seu Account SID
  var authToken = '3f61c2dd219df8824544c80688298523';   // Substitua pelo seu Auth Token
  var fromNumber = 'whatsapp:+14155238886'; // Substitua pelo seu número WhatsApp Twilio

  var payload = {
    'From': fromNumber,
    'To': 'whatsapp:' + numero,
    'Body': mensagem + ' ' + urlPdf + assinatura
  };

  var options = {
    'method': 'post',
    'headers': {
      'Authorization': 'Basic ' + Utilities.base64Encode(accountSid + ':' + authToken),
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    'payload': payload
  };

  var response = UrlFetchApp.fetch('https://api.twilio.com/2010-04-01/Accounts/' + accountSid + '/Messages.json', options);
  Logger.log('Resposta da Twilio: ' + response.getContentText());
}
