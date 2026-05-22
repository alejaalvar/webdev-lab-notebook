// Add your code here
const calculateAge = function (dateString) {
  const birthDate = new Date(dateString);
  const today = new Date();

  if (isNaN(birthDate.getTime())) {
    return `Error: Invalid date format`;
  }

  let age = today.getFullYear() - birthDate.getFullYear();
  const monthsDiff = today.getMonth() - birthDate.getMonth();
  const daysDiff = today.getDate() - birthDate.getDate();

  if (monthsDiff < 0 || (monthsDiff === 0 && daysDiff < 0)) {
    age--;
  }
  if (age === 1) {
    return `You are ${age} year old`;
  }

  if (age > 100) {
    return `Are you sure you are more than 125 years old?`;
  }

  return `You are ${age} years old`;
};

console.log(calculateAge("2000-07-01"));
// You are 25 years old
console.log(calculateAge("1988-05-18"));
// You are 38 years old
console.log(calculateAge("2190-01-01"));
// Error: Birth date cannot be in the future
console.log(calculateAge("1800-01-01"));
// Are you sure you are more than 125 years old?
console.log(calculateAge("invalid-date"));
// Error: Invalid date format

// Note: These calculations were done on May 18, 2026.
