import React from 'react'
import UserTable from './_components/user-table'

type Props = {}

const UserManagementPage = (props: Props) => {  
  return (
    <div className="flex p-2 min-h-screen flex-col w-full">
        <UserTable />
    </div>
  )
}

export default UserManagementPage