import classes from './profile-form.module.css'
import {useRef} from 'react'
import {useRouter} from 'next/router'

function ProfileForm() {
    const router = useRouter()
   const newPasswordRef = useRef()
   const oldPasswordRef = useRef()
   async function handlePasswordChange(event) {
       event.preventDefault()
       const oldPassword = oldPasswordRef.current.value
       const newPassword = newPasswordRef.current.value
       const res = await fetch('/api/user/change-password', {
           method: 'PATCH',
           body: JSON.stringify({newPassword, oldPassword}),
           headers: {
               'Content-Type': 'application/json'
           }
       })
       const data = await res.json()
       if(res.ok) {
            await router.replace('/')
       }
       console.log(data)
   }
  return (
    <form className={classes.form} onSubmit={handlePasswordChange}>
      <div className={classes.control}>
        <label htmlFor='new-password'>New Password</label>
        <input type='password' id='new-password' ref={newPasswordRef} required />
      </div>
      <div className={classes.control}>
        <label htmlFor='old-password'>Old Password</label>
        <input type='password' id='old-password' ref={oldPasswordRef} required/>
      </div>
      <div className={classes.action}>
        <button>Change Password</button>
      </div>
    </form>
  )
}

export default ProfileForm
