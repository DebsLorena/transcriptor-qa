export interface Command {
  id?: string;
  action: string;
  target?: string;
  value?: string;
  description?: string;
  priority?: number;
}