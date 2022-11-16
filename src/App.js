import { useEffect, useState } from 'react'
import logo from './logo.svg'

import './App.css'
import web3 from './web3'
import lottery from './lottery'

function App() {
  const [manager, setManager] = useState('')
  const [players, setPlayers] = useState([])
  const [ballance, setBallance] = useState('')
  const [current, setCurrent] = useState('')
  const [isMAnager, setIsManager] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const main = async () => {
      const managersAddress = await lottery.methods.manager().call()
      const players = await lottery.methods.participants().call({})
      const ballance = await web3.eth.getBalance(lottery.options.address)
      const currentUser = await web3.eth.getAccounts()
      if (String(managersAddress) == String(currentUser[0])) {
        setIsManager(true)
      }
      setManager(managersAddress)
      setPlayers(players)
      setBallance(ballance)
      setCurrent(currentUser[0])
    }
    main()
  }, [loading])
  const onEnter = async (e) => {
    e.preventDefault()
    const currentUser = await web3.eth.getAccounts()
    if (!e.target.children.ether.value) return
    const val = web3.utils.toWei(e.target.children.ether.value, 'ether')
    try {
      setLoading(true)

      await lottery.methods
        .join()
        .send({ from: currentUser[0], value: val, gas: '1000000' })
      setLoading(false)
      e.target.children.ether.value = 0
    } catch (error) {
      setLoading(false)
    }
  }
  const onPick = async () => {
    const currentUser = await web3.eth.getAccounts()
    try {
      setLoading(true)
      await lottery.methods.pickWinner().send({
        from: currentUser[0],
        gas: '10000000',
      })
      setLoading(false)
    } catch (error) {
      setLoading(false)
    }
  }
  return (
    <div className="App">
      <h2>Lottery Contract</h2>
      <p>This Contract is managed by : {manager}</p>
      <p>there are {players.length} participants</p>
      <h2>
        Current ballance is {web3.utils.fromWei(ballance, 'ether')} ether!!!
      </h2>
      <h2>Want to try your luck?</h2>
      <form onSubmit={onEnter}>
        <input name="ether" />
        <br />
        {loading && <h1>Loading your transaction...</h1>}
        <br />
        <button type="submit"> Enter</button>
      </form>
      <br />
      {isMAnager && <button onClick={onPick}>Pick winner</button>}
    </div>
  )
}

export default App
