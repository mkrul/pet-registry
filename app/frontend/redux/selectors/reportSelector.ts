import { RootState } from '../../redux/store';
import { IReport } from '../../types/reports/Report';

export const selectReport = (state: RootState, id: number): IReport | undefined => {
  const queryKeys = Object.keys(state.reportsApi.queries).filter(key => key.includes('getReports'));

  for (const queryKey of queryKeys) {
    const queryData = state.reportsApi.queries[queryKey]?.data as { data?: IReport[] } | undefined;

    const foundReport = queryData?.data?.find((report: IReport) => report.id === id);

    if (foundReport) {
      return foundReport;
    }
  }

  return undefined;
};
