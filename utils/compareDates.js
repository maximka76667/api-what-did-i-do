function compareDates(a, b) {
  return new Date(b.date) - new Date(a.date);
}

module.exports = compareDates;
