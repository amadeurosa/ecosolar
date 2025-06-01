const form = document.getElementById('form-dados');
const graficoCanvas = document.getElementById('grafico');
const climaDiv = document.getElementById('clima');
const recomendacoesDiv = document.getElementById('recomendacoes');
let chart;
let climaAtualTexto = '';

function salvarDados(e) {
  e.preventDefault();
  const data = document.getElementById('data').value;
  const producao = Number(document.getElementById('producao').value);
  const consumo = Number(document.getElementById('consumo').value);
  const dados = JSON.parse(localStorage.getItem('ecoDados')) || [];
  dados.push({ data, producao, consumo });
  localStorage.setItem('ecoDados', JSON.stringify(dados));
  form.reset();
  atualizarGrafico();
  atualizarRecomendacoes();
}

function limparDados() {
  localStorage.removeItem('ecoDados');
  atualizarGrafico();
  recomendacoesDiv.innerHTML = '';
}

function atualizarGrafico() {
  const dados = JSON.parse(localStorage.getItem('ecoDados')) || [];
  const labels = dados.map(d => d.data);
  const producao = dados.map(d => d.producao);
  const consumo = dados.map(d => d.consumo);

  if (chart) chart.destroy();
  chart = new Chart(graficoCanvas, {
    type: 'line',
    options: {
      responsive: true,
      maintainAspectRatio: false 
    },
    data: {
      labels,
      datasets: [
        {
          label: 'Produção (kWh)',
          data: producao,
          borderColor: 'green',
          fill: false
        },
        {
          label: 'Consumo (kWh)',
          data: consumo,
          borderColor: 'red',
          fill: false
        }
      ]
    }
  });
}

function gerarRecomendacoesAvancadas(dados, clima) {
  let totalProducao = 0, totalConsumo = 0;
  let recomendacoes = [];

  dados.forEach(d => {
    totalProducao += d.producao;
    totalConsumo += d.consumo;
  });

  const proporcao = totalProducao / totalConsumo;
  const desperdicio = totalConsumo - totalProducao;

  if (totalProducao === 0) {
    recomendacoes.push("⚠️ Produção zerada. Verifique os painéis ou falha no sistema.");
  } else if (proporcao < 0.7) {
    recomendacoes.push("⚠️ Consumo muito acima da produção. Considere otimizar o uso de equipamentos ou expandir sua planta solar.");
  } else if (proporcao < 1) {
    recomendacoes.push("🔍 Produção inferior ao consumo. Tente realocar o uso de energia para horários de maior incidência solar.");
  } else if (proporcao >= 1 && proporcao < 1.5) {
    recomendacoes.push("✅ Boa eficiência energética. Produção ligeiramente superior ao consumo.");
  } else {
    recomendacoes.push("🌞 Alta produção! Considere armazenar energia para uso posterior.");
  }

  if (clima.toLowerCase().includes('nublado')) {
    recomendacoes.push("🌥️ Clima nublado: produção solar pode estar reduzida.");
  } else if (clima.toLowerCase().includes('ensolarado')) {
    recomendacoes.push("☀️ Dia ensolarado! Aproveite para usar equipamentos de maior consumo.");
  }

  const ultimos5 = dados.slice(-5);
  const diasComConsumoMaior = ultimos5.filter(d => d.consumo > d.producao).length;
  if (diasComConsumoMaior >= 4) {
    recomendacoes.push("📈 Tendência: consumo frequentemente maior que a produção.");
  }

  if (desperdicio > 20) {
    recomendacoes.push(`📊 Diferença detectada: ${desperdicio.toFixed(1)} kWh de consumo acima da produção.`);
  }

  return recomendacoes.join('\n');
}

function atualizarRecomendacoes() {
  const dados = JSON.parse(localStorage.getItem('ecoDados')) || [];
  if (dados.length === 0) {
    recomendacoesDiv.innerText = 'Nenhum dado inserido.';
    return;
  }

  const texto = gerarRecomendacoesAvancadas(dados, climaAtualTexto);
  recomendacoesDiv.innerText = texto;
}

function gerarPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  const dados = JSON.parse(localStorage.getItem('ecoDados')) || [];
  let totalProducao = 0, totalConsumo = 0;
  dados.forEach(d => {
    totalProducao += d.producao;
    totalConsumo += d.consumo;
  });

  const eficiencia = totalConsumo > totalProducao ? 'Baixa (Consumo > Produção)' : 'Boa';
  const agora = new Date().toLocaleString('pt-BR');
  const recomendacao = gerarRecomendacoesAvancadas(dados, climaAtualTexto);
  const clima = climaAtualTexto || 'Sem dados climáticos.';
  const ultimos = dados.slice(-5);

  const logo = new Image();
  logo.src = 'img/logo.png';
  logo.onload = () => {
    doc.addImage(logo, 'PNG', 80, 10, 50, 20);
    doc.setFontSize(16);
    doc.text('Relatório de Consumo - EcoSolar', 10, 35);

    doc.setFontSize(10);
    doc.text(`Data/Hora: ${agora}`, 10, 43);
    doc.text(`Produção total: ${totalProducao.toFixed(1)} kWh`, 10, 50);
    doc.text(`Consumo total: ${totalConsumo.toFixed(1)} kWh`, 10, 57);
    doc.text(`Eficiência: ${eficiencia}`, 10, 64);

    doc.setFontSize(12);
    doc.text('Últimos 5 registros:', 10, 75);
    doc.setFontSize(10);
    let linhaY = 81;
    doc.text('Data        | Produção (kWh) | Consumo (kWh)', 10, linhaY);
    linhaY += 6;
    ultimos.forEach(d => {
      const linha = `${d.data.padEnd(11)} | ${d.producao.toFixed(1).padStart(15)} | ${d.consumo.toFixed(1).padStart(14)}`;
      doc.text(linha, 10, linhaY);
      linhaY += 6;
    });

    doc.setFontSize(12);
    doc.text('Recomendações:', 10, linhaY + 4);
    doc.setFontSize(10);
    doc.text(doc.splitTextToSize(recomendacao, 180), 10, linhaY + 10);

    let climaY = linhaY + 25;
    doc.setFontSize(12);
    doc.text('Clima atual:', 10, climaY);
    doc.setFontSize(10);
    doc.text(doc.splitTextToSize(clima, 180), 10, climaY + 6);

    html2canvas(graficoCanvas).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      doc.addImage(imgData, 'PNG', 10, climaY + 20, 180, 80);
      doc.save('relatorio-ecosolar.pdf');
    });
  };
}

function buscarClima() {
  fetch('https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/Sorocaba?unitGroup=metric&key=AZ5SEZ3FP9TCSNKYDE3Q2FKJV&contentType=json')
    .then(res => {
      if (!res.ok) throw new Error('Erro na resposta da API');
      return res.json();
    })
    .then(data => {
      const hoje = data.days[0];
      const temp = hoje.temp.toFixed(1);
      const desc = hoje.conditions;
      climaAtualTexto = `Temperatura: ${temp}°C, Condição: ${desc}`;
      climaDiv.innerText = climaAtualTexto;
      atualizarRecomendacoes();
    })
    .catch((error) => {
      console.error(error);
      climaAtualTexto = 'Erro ao carregar dados do clima.';
      climaDiv.innerText = climaAtualTexto;
    });
}

form.addEventListener('submit', salvarDados);
atualizarGrafico();
buscarClima();
