import axios from 'axios'
import React, { useEffect } from 'react'
import { serverUrl } from '../App.jsx'
import { useDispatch, useSelector } from 'react-redux'
import { setUserData } from '../redux/userSlice.js'
import { setMyShopData } from '../redux/ownerSlice.js'

function useGetMyshop() {
  const dispatch = useDispatch()
  const { userData } = useSelector(state => state.user)
  useEffect(() => {
    const fetchShop = async () => {
      try {
        const result = await axios.get(`${serverUrl}/api/shop/get-my`, { withCredentials: true })
        dispatch(setMyShopData(result.data))

      } catch (error) {
        console.log(error)
      }
    }
    if (userData && userData.role === "owner") {
      fetchShop()
    }
  }, [userData])
}

export default useGetMyshop
