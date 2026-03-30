import { Component, ReactNode } from 'react';

interface Props { children: ReactNode; fallback?: ReactNode }
interface State { hasError: boolean; message?: string }

export class SectionErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(e: Error): State {
    return { hasError: true, message: e.message };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="section-error">
          <p>⚠️ 此小节渲染异常</p>
          {this.state.message && <p className="text-xs mt-1">{this.state.message}</p>}
        </div>
      );
    }
    return this.props.children;
  }
}
