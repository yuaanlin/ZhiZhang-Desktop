function numberWithCommas(x: number) {
  return (Math.round(100 * x) / 100)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export default numberWithCommas;
