import { useState } from 'react'
import Nav from './nav'
import Accounts from './accounts'

const Index = () => {
  const [active, setActive] = useState('Accounts')

  return (
    <div className='flex h-full w-full overflow-hidden'>
      <div className='bg-neutral-50 w-1/3 h-full rounded-tl-md rounded-bl-md'>
        <Nav active={active} setActive={setActive}/>
      </div>
      <div className='bg-white w-full h-full rounded-tr-md rounded-br-md'>
      {
        {
          Accounts: <Accounts />,
          
        }[active]
      }
      </div>
    </div>
  )
}

export default Index