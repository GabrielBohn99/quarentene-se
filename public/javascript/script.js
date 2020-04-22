let dataSearch = document.querySelector('#dataSearch');
let addData = document.querySelector('#addData');

// DATE CONFIG
const dateFormater = () => {
  const date = new Date();

  let month = date.getMonth() + 1;
  let day = date.getDate();
  let year = date.getFullYear();

  if (day < 10) day = `0${day}`;
  if (month < 10) month = `0${month}`;

  return `${year}-${month}-${day}`;
};

if (addData) {
    addData.min = dateFormater();
}
if (dataSearch) {
    dataSearch.min = dateFormater();
}

