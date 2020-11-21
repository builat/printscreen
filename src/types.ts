export type FontCfg<T = unknown> = {
  uri: string;
  format: string;
  name: string;
  options?: T;
};

export type FontFaceTemplate = <T = unknown>(font: FontCfg & T) => string;

export type PrintScreenParamsT = {
  scale?: number;
  fonts?: FontCfg[];
  underlayStyle?: string;
  fontFaceTemplate: FontFaceTemplate;
};

export type SvgDementions = { width: number; height: number };
