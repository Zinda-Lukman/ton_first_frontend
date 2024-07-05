import './App.css'
import { TonConnectButton } from '@tonconnect/ui-react'
import {useMainContract} from "./hooks/useMainContract"
import {useTonConnect} from "./hooks/useTonConnect"
import WebApp from "@twa-dev/sdk"
import { fromNano } from '@ton/core'

function App() {
  const {
    contractAddress,
    counter_value,
    balance,
    sendIncrement
  } = useMainContract()

  const {connected} = useTonConnect()

  const showAlert = () => {
    WebApp.showAlert("Hello, World. This is Lookman.")
  }
  return (
    <div>
    <div>
      <TonConnectButton />
    </div>
    <div>
      <div className='Card'>
        <b>{WebApp.platform}</b>
        <b>Our contract Address</b>
        <div className='Hint'>
          {contractAddress?.slice(0,30) + "..."}
        </div>
        <b>Our contract Balance</b>
        <div className="Hint">{fromNano(balance)}
        </div>
      </div>

    <div className='Card'>
      <b>Counter Value</b>
      <div>{counter_value ?? "Loading..."}<div/>
      </div>
    </div>
    <a onClick={() =>{
      showAlert();
    }}> Show Alert</a>
    {connected && (
      <a onClick={() => {
        sendIncrement()
      }}>
        Increment
      </a>
    )}
    </div>
    </div>
  )
}

export default App
