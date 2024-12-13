<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Cadastro de Ocorrências</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 0;
      background: linear-gradient(to bottom, #c0c0c0, #a9a9a9);
      height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .container {
      width: 800px;
      background: linear-gradient(to bottom, #e0e0e0, #90ee90);
      border-radius: 10px;
      box-shadow: 0 0 20px rgba(0,0,0,0.2);
      padding: 20px;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
    }

    h2 {
      text-align: center;
      margin-bottom: 20px;
      color: #333;
      text-transform: uppercase;
      font-size: 16px;
    }

    form {
      display: flex;
      flex-direction: column;
    }

    .form-group {
      display: flex;
      align-items: center;
      margin-bottom: 15px;
      width: 100%;
    }

    .form-group label {
      width: 150px;
      font-weight: bold;
      color: #333;
      text-transform: uppercase;
      border: 2px outset #ccc;
      padding: 5px;
      box-shadow: 2px 2px 5px #aaa;
      background: #f0f0f0;
      text-align: center;
      font-size: 12px;
      margin-right: 10px;
    }

    .form-group input[type="text"],
    .form-group select,
    .form-group input[type="date"],
    .form-group textarea {
      padding: 8px;
      border: 2px inset #ccc;
      border-radius: 4px;
      text-transform: uppercase;
      box-shadow: inset 2px 2px 5px #aaa;
      background: #fff;
      font-family: Arial, sans-serif;
      font-size: 12px;
      width: 100%;
    }

    .form-group textarea {
      resize: vertical;
      height: 80px;
    }

    .half-width {
      width: 48%;
      box-sizing: border-box;
    }

    .inline-group {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      margin-bottom: 15px;
    }

    .buttons {
      display: flex;
      justify-content: center;
      margin-top: 20px;
    }

    .buttons button {
      background-color: #4CAF50;
      color: white;
      padding: 10px 20px;
      margin: 0 10px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 16px;
      box-shadow: 0 5px #2e7d32;
      text-transform: uppercase;
      font-weight: bold;
      transition: all 0.1s ease;
      font-family: Arial, sans-serif;
    }

    .buttons button:active {
      box-shadow: 0 2px #2e7d32;
      transform: translateY(3px);
    }

    .foto-container {
      width: 100px;
      height: 100px;
      border: 2px solid #ccc;
      border-radius: 5px;
      overflow: hidden;
      box-shadow: 2px 2px 5px #aaa;
      background: #fff;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      margin-left: auto;
    }

    .foto-container img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: none;
    }

    .foto-container label {
      background: #4CAF50;
      color: white;
      padding: 5px;
      border-radius: 3px;
      cursor: pointer;
      text-align: center;
      width: 100%;
      font-size: 12px;
      margin-top: 5px;
    }

    .pdf-container {
      display: flex;
      align-items: center;
      margin-top: 20px;
      padding: 10px;
      border: 2px solid #ccc;
      border-radius: 4px;
      background: #f9f9f9;
    }

    .pdf-container iframe {
      flex: 1;
      height: 200px;
      border: none;
    }

    .pdf-container button {
      margin-left: 10px;
      background-color: #007BFF;
      color: white;
      padding: 10px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
      font-family: Arial, sans-serif;
      box-shadow: 0 3px #0056b3;
      transition: all 0.1s ease;
    }

    .pdf-container button:hover {
      background-color: #0056b3;
    }

    .pdf-container button:active {
      box-shadow: 0 1px #0056b3;
      transform: translateY(2px);
    }

    @media (max-width: 600px) {
      .container {
        width: 100%;
        padding: 10px;
      }

      .form-group {
        flex-direction: column;
        align-items: flex-start;
      }

      .form-group label {
        width: 100%;
        margin-bottom: 5px;
      }

      .half-width {
        width: 100%;
      }

      .inline-group {
        flex-direction: column;
      }

      .buttons {
        flex-direction: column;
      }

      .buttons button {
        margin: 10px 0;
        width: 100%;
      }

      .foto-container {
        margin-left: 0;
        margin-top: 10px;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <form id="ocorrenciaForm">
      <h2>Cadastro de Ocorrências</h2>

      <!-- Linha 1: Nome do Aluno e Foto -->
      <div class="inline-group">
        <div class="form-group" style="width: 70%;">
          <label for="nomeAluno">NOME DO ALUNO:</label>
          <input type="text" id="nomeAluno" name="nomeAluno" required>
        </div>
        <div class="foto-container">
          <img id="fotoAluno" alt="Foto do Aluno" src="">
          <label for="fotoInput">+ FOTO</label>
          <input type="file" id="fotoInput" accept="image/*" style="display: none;">
        </div>
      </div>

      <!-- Linha 2: Ano/Série e Professor -->
      <div class="inline-group">
        <div class="form-group half-width">
          <label for="anoSerie">ANO/SÉRIE:</label>
          <input type="text" id="anoSerie" name="anoSerie" class="half-width" required>
        </div>
        <div class="form-group half-width">
          <label for="professor">PROFESSOR:</label>
          <input type="text" id="professor" name="professor" class="half-width" required>
        </div>
      </div>

      <!-- Linha 3: RA e Disciplina -->
      <div class="inline-group">
        <div class="form-group half-width">
          <label for="ra">RA:</label>
          <input type="text" id="ra" name="ra" class="half-width">
        </div>
        <div class="form-group half-width">
          <label for="disciplina">DISCIPLINA:</label>
          <input type="text" id="disciplina" name="disciplina" class="half-width">
        </div>
      </div>

      <!-- Linha 4: Classificação e Número WhatsApp -->
      <div class="inline-group">
        <div class="form-group half-width">
          <label for="descricaoOcorrencia">CLASSIFICAÇÃO:</label>
          <select id="descricaoOcorrencia" name="descricaoOcorrencia" class="half-width" required>
            <option value="">Selecione</option>
            <option value="OCORRÊNCIA">OCORRÊNCIA</option>
            <option value="SUSPENSÃO">SUSPENSÃO</option>
          </select>
        </div>
        <div class="form-group half-width">
          <label for="numeroWhatsApp">NÚMERO WHATSAPP:</label>
          <input type="text" id="numeroWhatsApp" name="numeroWhatsApp" class="half-width" placeholder="+5511999999999">
        </div>
      </div>

      <!-- Linha 5: Data do Registro e Data de Retorno -->
      <div class="inline-group">
        <div class="form-group half-width">
          <label for="dataRegistro">DATA DO REGISTRO:</label>
          <input type="date" id="dataRegistro" name="dataRegistro" class="half-width" required>
        </div>
        <div class="form-group half-width" id="dataRetornoGroup" style="display: none;">
          <label for="dataRetorno">DATA DE RETORNO:</label>
          <input type="date" id="dataRetorno" name="dataRetorno" class="half-width">
        </div>
      </div>

      <!-- Linha 6: Descrição -->
      <div class="form-group">
        <label for="descricao">DESCRIÇÃO:</label>
        <textarea id="descricao" name="descricao" required></textarea>
      </div>

      <div class="buttons">
        <button type="submit">Cadastrar</button>
        <button type="button" id="downloadDocumentoButton" disabled>Download Documento</button>
        <button type="button" id="limparButton" disabled>Limpar</button>
      </div>
    </form>

    <div class="pdf-container" id="pdfContainer" style="display: none;">
      <iframe id="pdfFrame" src=""></iframe>
      <button id="downloadPdfButton">Download PDF</button>
    </div>
  </div>

<script>
  const WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbwNMYOusjhGLs5EUCNZHphL7-ppOKsNExxp-cDWVOVvq56ye_hn8OagtlX6QpXoiavS/exec';

  document.getElementById('ocorrenciaForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const form = document.getElementById('ocorrenciaForm');
    const formData = {
      nomeAluno: form.nomeAluno.value,
      anoSerie: form.anoSerie.value,
      professor: form.professor.value,
      ra: form.ra.value,
      disciplina: form.disciplina.value,
      descricao: form.descricao.value,
      descricaoOcorrencia: form.descricaoOcorrencia.value,
      dataRegistro: form.dataRegistro.value,
      dataRetorno: form.dataRetorno.value,
      numeroWhatsApp: form.numeroWhatsApp.value,
    };

    fetch(WEB_APP_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`Erro no servidor: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      if (data.success) {
        alert(data.message);
        if (data.pdfUrl) {
          window.open(data.pdfUrl, '_blank');
        }
      } else {
        alert(`Erro: ${data.message}`);
      }
    })
    .catch(error => {
      console.error(error);
      alert(`Erro ao enviar dados: ${error.message}`);
    });
  });
</script>

</body>
</html>
