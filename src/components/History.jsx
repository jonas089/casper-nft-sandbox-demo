import React from "react";

export default class HistoryComponent extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="bg-gray-800">
        <h1 className='text-red-400 text-center outline outline-red-400'>Sandbox App - Deploy History</h1>
        <div className='grid place-items-center'>
          {this.props.history.map((deploy, id) => (
            <div class="px-5 py-6">
              <div class="max-w-sm rounded break-all shadow-lg px-4 bg-gray-200 py-2 ">
                <a className='text-blue-600' href={'https://testnet.cspr.live/deploy/'+deploy}>{deploy}</a>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
}
