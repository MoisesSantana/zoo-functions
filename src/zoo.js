/*
eslint no-unused-vars: [
  "error",
  {
    "args": "none",
    "vars": "local",
    "varsIgnorePattern": "data"
  }
]
*/

const data = require('./data');

const { animals, employees, prices, hours } = data;

// HoF includes = (Murilo Wolf);
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/includes

function animalsByIds(...rest) {
  return animals.filter(objects => rest.includes(objects.id));
}

function animalsOlderThan(animal, age) {
  return animals.find(animalsObject => animalsObject.name === animal)
  .residents.every(item => item.age > age);
}

function employeeByName(employeeName) {
  const [expectedObject = {}] = employees.filter(item => item
    .firstName === employeeName || item.lastName === employeeName);
  return expectedObject;
}

function createEmployee(personalInfo, associatedWith) {
  const { id, firstName, lastName } = personalInfo;
  const { managers, responsibleFor } = associatedWith;
  const expectedObject = { id, firstName, lastName, managers, responsibleFor };
  return expectedObject;
}

function isManager(id) {
  return employees.some(item => item.managers.includes(id));
}

function addEmployee(id, firstName, lastName, managers = [], responsibleFor = []) {
  const newEmployee = {
    id,
    firstName,
    lastName,
    managers,
    responsibleFor,
  };
  employees.push(newEmployee);
}

function animalCount(species) {
  if (species) {
    const expectedObject = animals.find(item => item.name === species);
    return expectedObject.residents.length;
  }
  return animals.reduce((result, item) => {
    const currentName = item.name;
    const currentLength = item.residents.length;
    result[currentName] = currentLength;
    return result;
  }, {});
}

function entryCalculator(entrants = {}) {
  if (Object.keys(entrants).length === 0) return 0;
  const keysOfEntrants = Object.keys(entrants);
  return keysOfEntrants.reduce((result, item) => {
    const valueByAge = entrants[item] * prices[item];
    result += valueByAge;
    return result;
  }, 0);
}

const createArrAnimalsForLocation = (arrOfLocation) => {
  const arrAnimalsFromNE = [];
  const arrAnimalsFromNW = [];
  const arrAnimalsFromSE = [];
  const arrAnimalsFromSW = [];

  animals.forEach((object) => {
    if (object.location === arrOfLocation[0]) arrAnimalsFromNE.push(object.name);
    if (object.location === arrOfLocation[1]) arrAnimalsFromNW.push(object.name);
    if (object.location === arrOfLocation[2]) arrAnimalsFromSE.push(object.name);
    if (object.location === arrOfLocation[3]) arrAnimalsFromSW.push(object.name);
  });

  return [arrAnimalsFromNE, arrAnimalsFromNW, arrAnimalsFromSE, arrAnimalsFromSW];
};

const createArrLocal = () => {
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set (Hamaji);

  const arrOfLocation = new Set();
  animals.forEach(object => arrOfLocation.add(object.location));
  return [...arrOfLocation];
};

const getSex = (arrOfObjects, sex) => {
  let sexArr = arrOfObjects.map((animal) => {
    if (animal.sex === sex) return animal;
    return false;
  });
  sexArr = sexArr.filter(element => element);
  return sexArr;
};

const arrForNames = (animal, sex) => {
  let arrOfObjects = animals.filter(item => item.name === animal);

  arrOfObjects = arrOfObjects[0];
  arrOfObjects = arrOfObjects.residents;
  if (sex !== undefined) arrOfObjects = getSex(arrOfObjects, sex);
  return arrOfObjects.map(item => item.name);
};

const initialObject = (arrOfNames, arrOfLocation) => arrOfLocation
.reduce((result, local, index) => {
  result[local] = arrOfNames[index];
  return result;
}, {});

const functionForIncludeNames = (arrOfLocation, testOne, sorted, sex) => {
  const expectedInArr = arrOfLocation.map((local) => {
    const animalsForLocation = testOne[local];

    return animalsForLocation.map((animal) => {
      const expectedObject = {};
      const expectedValue = arrForNames(animal, sex);
      if (sorted) expectedValue.sort();
      expectedObject[animal] = expectedValue;
      return expectedObject;
    });
  });
  return initialObject(expectedInArr, arrOfLocation);
};

function animalMap(options) {
  let result;

  const arrOfLocation = createArrLocal();
  const arrNamesForLocation = createArrAnimalsForLocation(arrOfLocation);

  if (options === undefined) return initialObject(arrNamesForLocation, arrOfLocation);

  const { includeNames } = options;

  if (includeNames) {
    const { sorted } = options;
    const { sex } = options;

    result = functionForIncludeNames(
      arrOfLocation,
      initialObject(arrNamesForLocation, arrOfLocation),
      sorted,
      sex,
    );
  } else {
    result = initialObject(arrNamesForLocation, arrOfLocation);
  }
  return result;
}

const withoutParameters = (days) => {
  const expectedValues = Object.values(days);
  const exepectedKeys = Object.keys(days);

  expectedValues.forEach(({ open, close }, index) => {
    expectedValues[index] = `Open from ${open}am until ${close - 12}pm`;
    if (open + close === 0) expectedValues[index] = 'CLOSED';
  });

  return exepectedKeys.reduce((result, keys, index) => {
    result[keys] = expectedValues[index];
    return result;
  }, {});
};

function schedule(dayName) {
  if (dayName === undefined) return withoutParameters(hours);

  const expectedValue = Object.values(hours[dayName]);
  const [open, close] = expectedValue;
  const result = {};

  result[dayName] = `Open from ${open}am until ${close - 12}pm`;

  if (open + close === 0) result[dayName] = 'CLOSED';

  return result;
}

const getSpecie = (id) => {
  const employ = employees.find(objects => objects.id === id);
  const specie = animals.find(object => object.id === employ.responsibleFor[0]);
  const { residents } = specie;
  return residents;
};

function oldestFromFirstSpecies(id) {
  const residents = getSpecie(id);

  const expectedInfo = residents.reduce((result, object) => {
    if (object.age > result.age) return object;
    return result;
  });
  return Object.values(expectedInfo);
}

function increasePrices(percentage) {
  const arrTypeAndPrice = Object.entries(prices);
  
  arrTypeAndPrice.forEach((typeAndPrice) => {
    typeAndPrice[1] += (typeAndPrice[1] * percentage) / 100;
    typeAndPrice[1] = Math.round(typeAndPrice[1] * 100) / 100;
    prices[typeAndPrice[0]] = typeAndPrice[1];
  });
}

const createExpectedObject = (employee, result) => {
  const valuesForResult = [];

  employee.responsibleFor.forEach((id) => {
    const currentAnimal = animals.find(animal => animal.id === id);

    valuesForResult.push(currentAnimal.name);

    result[`${employee.firstName} ${employee.lastName}`] = valuesForResult;
  });
  return result;
};

const getAllEmployessAndAnimals = () => employees
.reduce((result, employee) => createExpectedObject(employee, result), {});

const getRealParameter = (idOrName) => {
  const currentObject = employees.find(employee => employee.id === idOrName
  || employee.firstName === idOrName
  || employee.lastName === idOrName);

  const result = {};
  return createExpectedObject(currentObject, result);
};

function employeeCoverage(idOrName) {
  if (!idOrName) return getAllEmployessAndAnimals();

  return getRealParameter(idOrName);
}

module.exports = {
  entryCalculator,
  schedule,
  animalCount,
  animalMap,
  animalsByIds,
  employeeByName,
  employeeCoverage,
  addEmployee,
  isManager,
  animalsOlderThan,
  oldestFromFirstSpecies,
  increasePrices,
  createEmployee,
};
