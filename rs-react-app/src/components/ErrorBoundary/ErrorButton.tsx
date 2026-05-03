import { Component } from 'react';

interface ErrorButtonState {
  showError: boolean;
}

export class ErrorButton extends Component<
  Record<string, unknown>,
  ErrorButtonState
> {
  constructor(props: Record<string, unknown>) {
    super(props);
    this.state = {
      showError: false,
    };
  }

  handleButtonClick = () => {
    this.setState({ showError: true });
  };

  render() {
    if (this.state.showError) {
      throw new Error('This is a test error!');
    }
    return (
      <button
        className="bg-purple-500 w-50 text-white font-semibold py-2 px-4 rounded hover:bg-purple-300 cursor-pointer transition-colors my-2"
        onClick={() => this.handleButtonClick()}
      >
        Check error boundary
      </button>
    );
  }
}
