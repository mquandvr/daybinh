export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("vi-VN").format(value);
};

export const calculateFuelCost = (capacity: number, price: number) => {
  return capacity * price;
};

export const validateArray = (data: any): boolean => {
  return Array.isArray(data);
};

export const parseFuelCapacity = (fuelTank: any): number => {
  if (fuelTank === undefined || fuelTank === null) return 4.5;
  const capStr = fuelTank.toString().replace(',', '.');
  const capNum = parseFloat(capStr);
  return isNaN(capNum) ? 4.5 : capNum;
};
