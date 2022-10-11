import React from "react";

export default class AccountComponent extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="bg-gray-800">
        <h1 className='text-red-400 text-center outline outline-red-400'>Sandbox App - Owned NFTs</h1>
        <div className= 'flex items-stretch items-center flex-wrap bg-cover'>
          {this.props.Metadata.map((meta, id) => (
            <div class="px-5 py-6">
              <div class="max-w-sm rounded break-all shadow-lg px-8 bg-gray-200 py-2 ">
              <p>{this.props.OwnedNFTs[id].toString()}</p>
              <img src={JSON.parse(meta)["nft_url"].toString()} alt="Random" className='w-full h-96' />
              <div class="px-6 py-4">
              <div class="font-bold text-xl mb-2">{JSON.parse(meta)["nft_name"].toString()}</div>
              <p class="text-gray-700 text-base">
              {JSON.parse(meta)["nft_description"].toString()}
              </p>
              </div>
            </div>
          </div>
          ))}
        </div>
      </div>
    );
  }
}
