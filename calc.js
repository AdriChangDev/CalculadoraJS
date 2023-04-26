function CalculadoraCientifica() {
  this.listaOperacionesHTML = document.getElementById(
    "listaOperacionesBasicas"
  );
  this.listaHTML = document.getElementById("listaNumeros");
  this.listaOperacionesMathHTML = document.getElementById(
    "listaOperacionesMath"
  );
  this.pantallaActual = document.getElementById("result");
  this.pantallaGuardar = document.getElementById("resultSave");
  this.listaNumeros = document.getElementById("listaNumeros");
  this.isResolve = false;
  this.isBasic = false;
  this.memory = 0;
  this.result = 0;
}

CalculadoraCientifica.prototype.numeros = [
  "⇆",
  "=",
  ".",
  "0",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
];

CalculadoraCientifica.prototype.operacionesBasicas = [
  "DEL",
  "AC",
  "+",
  "-",
  "*",
  "/",
  "(",
  ")",
];

CalculadoraCientifica.prototype.operacionMath = [
  "sen(",
  "cos(",
  "tg(",
  "arctg(",
  "√(",
  "log(",
  "ln(",
  "±",
  "ⅹ²",
  "|ⅹ|",
  "ⅹ³",
  "⅟",
  "%",
  "‰",
  "π",
  "ɘ",
  "ͳ",
  "10ⁿ",
  "Rd",
  "x!",
  "MC",
  "MR",
  "M+",
  "M-",
];

CalculadoraCientifica.prototype.letrasGriegas = ["π", "ɘ", "τ"];

CalculadoraCientifica.prototype.numeros.reverse();

CalculadoraCientifica.prototype.mr = function (calc) {
  pantallaActual.innerText = calc.memory;
};

CalculadoraCientifica.prototype.mc = function (calc) {
  calc.memory = 0;
  this.ScreenValueNow(pantallaActual, 0);
};

CalculadoraCientifica.prototype.mp = function (calc) {
  calc.memory += parseFloat(pantallaActual.innerText);
  this.ScreenValueNow(pantallaActual, 0);
};

CalculadoraCientifica.prototype.mm = function (calc) {
  calc.memory -= parseFloat(pantallaActual.innerText);
};

CalculadoraCientifica.prototype.addNumero = function (valor) {
  var estaComprendido = listaOperacionesBasicas.includes(valor);
  var resultado = pantallaActual.innerText;

  if (
    (pantallaActual.innerText == "0" ||
      pantallaActual.innerText == "Error" ||
      calc.letrasGriegas.includes(pantallaGuardar.innerText) ||
      this.isResolve == true) &&
    !estaComprendido
  ) {
    pantallaActual.innerHTML = "";
  }
  this.isResolve = false;
  switch (valor) {
    case "=":
      this.ScreenValueSafe(pantallaGuardar, pantallaActual.innerText);
      this.isResolve = true;
      if (!pantallaActual.innerText == "0") {
        this.ScreenValueNow(
          pantallaActual,
          this.equal(pantallaActual.innerText)
        );
      } else {
        this.clear();
      }
      break;
    case "AC":
      this.clear();
      break;
    case "DEL":
      this.ScreenValueNow(pantallaActual, this.deleteLastOne(resultado));
      break;
    case "|ⅹ|":
      var numero = this.absolute(resultado);
      if (isNaN(numero)) {
        pantallaActual.innerText = 0;
      } else {
        pantallaActual.innerText = numero;
        this.isResolve = true;
      }
      break;
    case "±":
      this.ScreenValueNow(pantallaActual, this.changeSign(resultado));
      break;
    case "ⅹ²":
      this.ScreenValueNow(pantallaActual, this.elevateGeneral(resultado, 2));
      break;
    case "ⅹ³":
      this.ScreenValueNow(pantallaActual, this.elevateGeneral(resultado, 3));
      break;
    case "⅟":
      this.ScreenValueNow(pantallaActual, this.oneDivided(resultado));
      break;
    case "%":
      this.ScreenValueNow(
        pantallaActual,
        this.calculatePercentage(resultado, 0.01)
      );
      break;
    case "‰":
      this.ScreenValueNow(
        pantallaActual,
        this.calculatePercentage(resultado, 0.001)
      );
      break;
    case "10ⁿ":
      this.ScreenValueNow(pantallaActual, this.elevateGeneral(10, resultado));
      break;
    case "x!":
      this.ScreenValueNow(pantallaActual, this.factorialNumber(resultado));
      break;
    case "Rd":
      this.ScreenValueNow(pantallaActual, this.Random());
      break;
    case "MR":
      this.mr(calc);
      break;
    case "MC":
      this.mc(calc);
      break;
    case "⇆":
      this.clear();
      this.changeBasic();
      break;
    case "M-":
      this.mm(calc);
      break;
    default:
      pantallaActual.innerText = this.defaultButtons(
        pantallaActual.innerText,
        valor
      );
  }
};

CalculadoraCientifica.prototype.testRepeat = function (lista, valor) {
  var ultimoCaracter = pantallaActual.innerText.slice(-1);
  return (
    lista.includes(valor) && lista.includes(ultimoCaracter) && valor != "("
  );
};

CalculadoraCientifica.prototype.replaceCharacter = function (expresion) {
  var replaceChars = {
    π: Math.PI.toFixed(4),
    ɘ: Math.E.toFixed(4),
    ͳ: 2 * Math.PI.toFixed(4),
    sen: "Math.sin",
    cos: "Math.cos",
    tg: "Math.tanh",
    arctg: "Math.atan2",
    "√": "Math.sqrt",
    log: "Math.log10",
    ln: "Math.log",
  };
  for (var caracter in replaceChars) {
    if (replaceChars.hasOwnProperty(caracter)) {
      expresion = expresion.replace(
        new RegExp(caracter, "g"),
        replaceChars[caracter]
      );
    }
  }

  return expresion;
};

CalculadoraCientifica.prototype.equal = function (expresion) {
  try {
    return new Function("return " + this.replaceCharacter(expresion))();
  } catch (e) {
    return "Error";
  }
};

CalculadoraCientifica.prototype.clear = function () {
  pantallaActual.innerText = "0";
  pantallaGuardar.innerText = "0";
};

CalculadoraCientifica.prototype.absolute = function (expresion) {
  return Math.abs(parseFloat(expresion));
};

CalculadoraCientifica.prototype.moreless = function (expresion) {
  return parseFloat(expresion) * -1;
};

CalculadoraCientifica.prototype.deleteLastOne = function (expresion) {
  if (expresion == "Error" || isNaN(expresion)) {
    return "0";
  } else {
    expresionNueva = this.isLastOneZero(expresion);
    return expresionNueva === "" ? "0" : expresionNueva;
  }
};

CalculadoraCientifica.prototype.defaultButtons = function (expresion, valor) {
  if (
    !this.testRepeat(listaOperacionesBasicas, valor) &&
    !this.testRepeat(listaOperacionesMath, valor)
  ) {
    return (expresion += valor);
  } else {
    var ultimoCarac = expresion.slice(-1);
    console.log(ultimoCarac);
    if (ultimoCarac == ")") {
      return (expresion += valor);
    } else {
      var expresionAntigua = expresion.slice(0, -1);
      var expresionNueva = expresionAntigua + valor;
      return expresionNueva;
    }
  }
};

CalculadoraCientifica.prototype.isLastOneZero = function (expresion) {
  var ultimoCaracter = expresion.slice(-1);
  if (listaOperacionesMath.includes(ultimoCaracter)) {
    // El último carácter es un elemento completo de operacionMath
    return expresion.slice(0, -ultimoCaracter.length);
  } else {
    // El último carácter no es un elemento completo de operacionMath
    return expresion.slice(0, -1);
  }
};

CalculadoraCientifica.prototype.factorialNumber = function (expresion) {
  this.isResolve = true;
  var resultado = 1;
  var numero = this.equal(expresion);
  return (function () {
    for (let i = 2; i <= numero; i++) {
      resultado *= i;
    }
    return resultado;
  })();
};

CalculadoraCientifica.prototype.Random = function () {
  this.isResolve = true;
  return Math.random().toFixed(5);
};

CalculadoraCientifica.prototype.calculatePercentage = function (
  resultado,
  porcentaje
) {
  this.isResolve = true;
  return resultado * porcentaje;
};

CalculadoraCientifica.prototype.elevateGeneral = function (numero, elevado) {
  this.isResolve = true;
  return Math.pow(this.equal(this.replaceCharacter(numero)), elevado);
};

CalculadoraCientifica.prototype.changeSign = function (numero) {
  return numero * -1;
};

CalculadoraCientifica.prototype.oneDivided = function (numero) {
  this.isResolve = true;
  return 1 / parseFloat(numero);
};
CalculadoraCientifica.prototype.ScreenValueNow = function (ScreenNow, value) {
  ScreenNow.innerText = value;
};

CalculadoraCientifica.prototype.ScreenValueSafe = function (ScreenSave, value) {
  ScreenSave.innerText = value;
};
CalculadoraCientifica.prototype.changeBasic = function () {
  if (!this.isBasic) {
    document.getElementById("hidde").style.display = "none";
    this.isBasic = true;
  } else {
    document.getElementById("hidde").style.display = "block";
    this.isBasic = false;
  }
};

window.onload = function () {
  addButtons();
};

var calc = new CalculadoraCientifica();
//TAKE LIST OF CALC
var listaNumeros = calc.numeros;
var listaOperacionesBasicas = calc.operacionesBasicas;
var listaOperacionesMath = calc.operacionMath;

//CONFIGURE BY ID
var listaOperacionesHTML = calc.listaOperacionesHTML;

var listaHTML = calc.listaNumeros;
var listaOperacionesMathHTML = calc.listaOperacionesMathHTML;
//SCREEN
var pantallaActual = calc.pantallaActual;
var pantallaGuardar = calc.pantallaGuardar;

function addButtons() {
  clearList(listaHTML);
  clearList(listaOperacionesHTML);
  clearList(listaOperacionesMathHTML);
  addNumber(listaOperacionesHTML, 2, listaOperacionesBasicas);
  addNumber(listaHTML, 3, listaNumeros, "numero");
  addNumber(listaOperacionesMathHTML, 6, listaOperacionesMath);
}

function clearList(listaBase) {
  while (listaBase.firstChild) {
    listaBase.removeChild(listaBase.firstChild);
  }
}

function addNumber(listaBase, num, listaNumeros) {
  for (let index = 0; index < listaNumeros.length; index++) {
    if (index % num === 0) {
      var divElement = document.createElement("div");
      divElement.setAttribute("class", "group");
    }
    divElement.appendChild(createNumberElement(listaNumeros[index]));
    listaBase.appendChild(divElement);
  }
}

function createNumberElement(numero) {
  var liBoton = document.createElement("button");
  liBoton.innerText = numero;
  liBoton.classList.add("boton");
  liBoton.setAttribute("onclick", "calc.addNumero('" + numero + "')");
  return liBoton;
}
