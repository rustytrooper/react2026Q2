import { Component } from 'react';
interface ErrorButtonState {
  showError: boolean;
}
export declare class ErrorButton extends Component<
  Record<string, unknown>,
  ErrorButtonState
> {
  constructor(props: Record<string, unknown>);
  handleButtonClick: () => void;
  render(): import('react/jsx-runtime').JSX.Element;
}
export {};
