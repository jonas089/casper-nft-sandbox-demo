import React from "react";
import { Mint, Transfer } from '../casper/controller.js';
export default class WebAppComponent extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className='bg-gray-800'>
        <h1 className='text-red-400 text-center outline outline-red-400'>Sandbox App</h1>

        <div className='grid py-[5%] place-items-center divide-x'>
          <div className="w-full max-w-xs">
            <form className="bg-white shadow-md rounded px-5 pt-6 pb-8 mb-4">
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" for="name">
                  Name
                </label>
                <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="name" type="text" placeholder="name..." onChange={this.props.handleName} value={this.props.name}/>
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2" for="description">
                  Description
                </label>
                <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" id="description" type="text" placeholder="description..." onChange={this.props.handleDescription} value={this.props.description}/>
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2" for="url">
                  Url
                </label>
                <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" id="url" type="text" placeholder="https://some.url/" onChange={this.props.handleUrl} value={this.props.url}/>
              </div>

              <div className="grid place-items-center">
                <button onClick={() => Mint(this.props.name, this.props.description, this.props.url, this.props.AccountHash, this.props.PubKey)} className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button">
                  Mint
                </button>
              </div>
            </form>

            <form className="bg-white shadow-md rounded px-5 pt-6 pb-8 mb-4">
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2" for="description">
                  Hash Id
                </label>
                <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" id="Id" type="text" placeholder="Token Hash Id..." onChange={this.props.handleId} value={this.props.Id}/>
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2" for="url">
                  Recipient
                </label>
                <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" id="Recipient" type="text" placeholder="0x00" onChange={this.props.handleRecipient} value={this.props.Recipient}/>
              </div>

              <div className="grid place-items-center">
                <button onClick={() => Transfer(this.props.Id, this.props.Recipient, this.props.AccountHash, this.props.PubKey)} className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button">
                  Transfer
                </button>
              </div>
            </form>

          </div>
        </div>
      </div>
    );
  }
}
