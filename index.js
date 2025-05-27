const readlineSync = require('readline-sync');
const faixas = require('./estados.json');
let opcao = -1;
let veiculosEstacionados = [];

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
  console.log(`--------------------------   ----\n`)

  const input = readlineSync.question('Escolha uma opcao: ');
  opcao = parseInt(input);

  switch (opcao) {

    case 1: {
      const placa = readlineSync.question('Digite a placa do carro: ').toUpperCase();
      const inputEntrada = readlineSync.question('Digite a hora de entrada: ');
      const [hNumberEntrada, minNumberEntrada] = inputEntrada.split(":").map(Number);
      const tempoEntrada = (hNumberEntrada * 60) + minNumberEntrada;

      const carroNovo = new Carro(placa, tempoEntrada);
      veiculosEstacionados.push(carroNovo);
      console.log(veiculosEstacionados);

      console.log(`\n Veiculo registrado com sucesso com a placa ${placa}`);
      break;
    }


    case 2: {
      const placaSaida = readlineSync.question('\nDigite uma placa para registrar a saida: ').toUpperCase();
      const index = veiculosEstacionados.findIndex(carro => carro.strPlaca === placaSaida);
      const inputSaida = readlineSync.question('Digite a hora de saida: ');
      const [hNumberSaida, minNumberSaida] = inputSaida.split(":").map(Number);
      const tempoSaida = (hNumberSaida * 60) + minNumberSaida;


      if (index !== -1) {
        const carro = veiculosEstacionados[index];
        const preco = calcularPreco(carro.tempoEntrada, tempoSaida)

        veiculosEstacionados.splice(index, 1);
        console.log(`\nVeículo com placa ${placaSaida} removido.`);
        console.log("\n--- TICKET DE ESTACIONAMENTO ---");
        console.log(`Placa do Veículo: ${placaSaida}`);
        console.log(`Hora de entrada: ${tempoParaHoras(carro.tempoEntrada)}`);
        console.log(`Hora de saida: ${tempoParaHoras(tempoSaida)}`);
        console.log(`Valor a Pagar: R$${preco},00`);
        console.log(`--------------------------------\n`);

      } else {
        console.log("Veículo não encontrado.");
      }

      break;
    }


    case 3: {
      console.log("");
      console.log(veiculosEstacionados);
      break;
    }

    case 4: {
      const placa = readlineSync.question("\nInsira uma placa para verificar o estado: ").toUpperCase();
      console.log(`\nA placa é do estado : ${identificarEstado(placa)}`);
      break;
    }


    case 0: {
      console.log('\nEncerrado o programa...');
      break;
    }
  }
}