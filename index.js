const readlineSync = require('readline-sync');
const faixas = require('./estados.json');
let opcao = -1;

const vagas = [
  [null, null, null],
  [null, null, null],
  [null, null, null],
];


function tempoParaHoras(tempoTotal) {
  let hora = parseInt(tempoTotal / 60);
  let minuto = tempoTotal % 60;
  return `${hora}:${minuto}`;
}

function calcularPreco(tempoEntrada, tempoSaida) {

  if (tempoSaida < tempoEntrada) {
    tempoSaida += 24 * 60;
  }

  const tempoTotal = tempoSaida - tempoEntrada;

  if (tempoTotal <= 15) {
    return 0;
  } else if (tempoTotal <= 180) {
    return 12;
  } else if (tempoTotal > 180) {
    return 12 + Math.ceil((tempoTotal - 180) / 60) * 4;
  }
}

function identificarEstado(placa) {
  const prefixo = placa.toUpperCase().slice(0, 3);
  
  for (const estado in faixas) {
    
    let inicio = faixas[estado].inicio;
    let fim = faixas[estado].fim;

    if (prefixo >= inicio && prefixo <= fim) {
      return estado.replace("_2", "")
    }
  }
  return "Estado desconhecido";
}

function encontrarVagaLivre() {
  for (let i = 0; i < vagas.length; i++) {
    for (let j = 0; j < vagas[i].length; j++) {
      if (vagas[i][j] === null) {
        return { i, j };
      }
    }
  }
  return null;
}

function encontrarVagaPorPlaca(placa) {
  for (let i = 0; i < vagas.length; i++) {
    for (let j = 0; j < vagas[i].length; j++) {
      const carro = vagas[i][j];
      if (carro && carro.strPlaca === placa) {
        return { i, j, carro };
      }
    }
  }
  return null;
}


class Carro {
  constructor(strPlaca, tempoEntrada) {
    this.strPlaca = strPlaca;
    this.tempoEntrada = tempoEntrada;
  }
}

while (opcao != 0) {
  console.log("\n--- MENU ESTACIONAMENTO ---");
  console.log("1. Registrar Entrada de Veículo");
  console.log("2. Registrar Saída de Veículo");
  console.log("3. Visualizar Ocupação");
  console.log("4. Verificar Estado da placa")
  console.log("0. Encerrar Programa");
  console.log(`------------------------------\n`)

  const input = readlineSync.question('Escolha uma opcao: ');
  opcao = parseInt(input);

  switch (opcao) {

    case 1: {
      const placa = readlineSync.question('Digite a placa do carro: ').toUpperCase();
      const inputEntrada = readlineSync.question('Digite a hora de entrada: ');
      const [hNumberEntrada, minNumberEntrada] = inputEntrada.split(":").map(Number);
      const tempoEntrada = (hNumberEntrada * 60) + minNumberEntrada;

      const carroNovo = new Carro(placa, tempoEntrada);

      const vaga = encontrarVagaLivre();

      if (!vaga) {
        console.log("Estacionamento lotado!");
        break;
      }

      vagas[vaga.i][vaga.j] = carroNovo;

      console.log(`\nVeiculo registrado com sucesso! Placa: ${placa} na vaga [${vaga.i}][${vaga.j}]`);
      break;
    }


    case 2: {
      const placaSaida = readlineSync.question('\nDigite a placa para registrar a saida: ').toUpperCase();
      const inputSaida = readlineSync.question('Digite a hora de saida (hh:mm): ');
      const [hSaida, mSaida] = inputSaida.split(":").map(Number);
      const tempoSaida = (hSaida * 60) + mSaida;

      const resultado = encontrarVagaPorPlaca(placaSaida);

      if (resultado) {
        const { i, j, carro } = resultado;
        const preco = calcularPreco(carro.tempoEntrada, tempoSaida);
        vagas[i][j] = null;

        console.log(`\n--- TICKET DE ESTACIONAMENTO ---`);
        console.log(`Placa do Veículo: ${placaSaida}`);
        console.log(`Vaga: [${i}][${j}]`);
        console.log(`Hora de entrada: ${tempoParaHoras(carro.tempoEntrada)}`);
        console.log(`Hora de saída: ${tempoParaHoras(tempoSaida)}`);
        console.log(`Valor a pagar: R$${preco},00`);
        console.log(`--------------------------------\n`);
      } else {
        console.log("Veículo não encontrado.");
      }

      break;
  }



    case 3: {
      console.log("\n--- Ocupação do Estacionamento ---");

      for (let i = 0; i < vagas.length; i++) {
        let linha = "";
        for (let j = 0; j < vagas[i].length; j++) {
          linha += vagas[i][j] ? `[${vagas[i][j].strPlaca}]` : `[ LIVRE ]`;
          }
        console.log(linha);
      } 
      console.log("\n--------------------------------");
      break;
    }

    case 4: {
      const placa = readlineSync.question("\nInsira uma placa para verificar o estado: ").toUpperCase();
      console.log(`\nA placa é do estado : ${identificarEstado(placa)}\n`);
      break;
    }


    case 0: {
      console.log('\nEncerrado o programa...\n');
      break;
    }
  }
}