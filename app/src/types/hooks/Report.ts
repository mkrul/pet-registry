export interface UseReportSubmitProps {
  submitReport: (data: FormData) => Promise<{ report?: any; message?: string }>;
  showBreed2: boolean;
  showColor2: boolean;
  showColor3: boolean;
}
