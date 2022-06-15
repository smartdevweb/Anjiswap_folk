import { Redirect, Route, Switch } from "react-router-dom"

import React from "react"
import Stake from '../pages/Stake'
import Swap from '../pages/Swap'
import Wallet from '../pages/Wallet'
import Test from '../pages/Test'
export default function Routes() {
  return (
    <Switch>
      <Route exact path="/" component={Wallet} />
      <Route exact path="/swap" component={Swap} />
      <Route exact path="/stake" component={Stake} />
      <Route exact path="/test" component={Test} />
      <Route render={() => <Redirect to="/"/>}/>
    </Switch>
  )
}
