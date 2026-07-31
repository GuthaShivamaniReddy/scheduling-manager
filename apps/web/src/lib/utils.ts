import { type ZDTFactory, zdtFactory } from "@vitalize-interview/utils/temporal";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getDatesBetween = (
  startDate: string,
  endDate: string,
): ZDTFactory.ZDT[] => {
  const dates: ZDTFactory.ZDT[] = [];

  let currentDate = zdtFactory.zdt(startDate);
  const endDateZDT = zdtFactory.zdt(endDate);
  while (currentDate.isBefore(endDateZDT.add({ days: 1 }))) {
    dates.push(currentDate);
    currentDate = currentDate.add({ days: 1 });
  }

  return dates;
};

export const addDaysToDate = (date: string, numDaysToAdd: number) => {
  return zdtFactory
    .zdt(date)
    .add({ days: numDaysToAdd })
    .format.toDateYear({ iso: true });
};
