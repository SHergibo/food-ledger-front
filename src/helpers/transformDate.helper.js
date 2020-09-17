exports.transformDate = (date) => {
  date = new Date(date)
  let day = date.getDate();
  if (day <= 9) {
    day = `0${day}`;
  }
  let month = date.getMonth() + 1;
  if (month <= 9) {
    month = `0${month}`;
  }
  return `${day}/${month}/${date.getFullYear()}`;
};

exports.addMonths = (months) => {
  let today = new Date()
  let d = today.getDate();
  today.setMonth(today.getMonth() + +months);
  if (today.getDate() !== d) {
    today.setDate(0);
  }
  return today.toISOString();
}