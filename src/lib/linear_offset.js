import * as d3 from "d3";

export function linear_offset(data){
  const x_mean = d3.mean(data, (d) => d.year);
  const y_mean = d3.mean(data, (d) => d.temp);

  let nominator = 0;
  let denominator = 0;

  for(const {year,temp} of data){
    const x_diff = year - x_mean;
    const y_diff = temp - y_mean;
    nominator += x_diff * y_diff;
    denominator += x_diff ** 2;
  }
  const slope = nominator / denominator;
  const offset = y_mean - slope * x_mean;

  return offset;
}