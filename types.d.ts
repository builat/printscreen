type FontCfg<T = unknown> = {
  uri: string;
  format: string;
  name: string;
  options?: T;
};

type FontFaceTemplate = <T = unknown>(font: FontCfg & T) => string;

type PrintScreenParamsT = {
  scale?: number;
  fonts?: FontCfg[];
  underlayStyle?: string;
  fontFaceTemplate: FontFaceTemplate;
};

type SvgDementions = { width: number; height: number };
