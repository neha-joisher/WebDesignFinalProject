import React, { useEffect } from 'react'
import axios from "axios";
import { useDispatch, useSelector } from 'react-redux'
import { listBookings } from '../../actions/bookingActions'
import Message from '../../components/Message'
import Loader from '../../components/Loader'
import { LinkContainer } from 'react-router-bootstrap'
import { Table, Button } from 'react-bootstrap'
import Swal from "sweetalert2";
import { Tag, Divider } from 'antd';
// import './bookingListScreen.css'

const BookingListScreen = () => {

      const dispatch = useDispatch()

      const listAllBookings = useSelector((state) => state.listAllBookings)
      const { loading, error, bookings } = listAllBookings

      useEffect(() => {
            dispatch((listBookings()))
      }, [dispatch])


      async function cancelBooking(bookingid, roomid) {


            try {
                  // loading(true);
                  const result = await (await axios.post('/api/booking/cancelbookings', { bookingid, roomid })).data
                  // loading(false);
                  Swal.fire('Congrats', 'Your Room has cancelled succeessfully', 'success').then(result => {
                        window.location.href = '/roomManagement'
                  })
            } catch (error) {
                  Swal.fire('Oops', 'Something went wrong', 'error').then(result => {
                        window.location.href = '/roomManagement'
                  })
                  // loading(false)
            }

      }

      return (
            <>
                  <h1>Bookings List</h1>
                  {
                        loading ? (
                              <Loader />
                        ) : error ? (
                              <Message variant='danger'>{error}</Message>
                        ) : (
                              <Table striped bordered hover responsive className='table-sm'>
                                    <thead>
                                          <tr>
                                                <th>Booking ID</th>
                                                <th>Room Name</th>
                                                <th>From</th>
                                                <th>To</th>
                                                <th>Days Count</th>
                                                <th>Total Cost USD</th>
                                                <th>Booking Status</th>
                                                <th>Cancel the booking</th>
                                          </tr>
                                    </thead>
                                    <tbody>
                                          {bookings.map((book) => (
                                                <tr key={book._id}>

                                                      <td>{book.bookingID}</td>
                                                      <td>{book.rooms}</td>
                                                      <td>{book.fromdate}</td>
                                                      <td>{book.todate}</td>
                                                      <td>{Math.round(book.totalDays)}</td>
                                                      <td>{book.totalAmount}</td>
                                                      <td>
                                                            <p><b>Status</b>: {book.status === 'booked' ? (<Tag color="green">Confirmed</Tag>) : (<Tag color="red">Cancelled</Tag>)}</p>

                                                      </td>
                                                      <td>
                                                            <div className='text-center'>
                                                                  {book.status === 'booked' && (<button className='btn-danger text-center' onClick={() => cancelBooking(book._id, book.roomid)}>Cancel</button>)}
                                                            </div>
                                                      </td>
                                                </tr>
                                          ))}
                                    </tbody>
                              </Table>
                        )
                  }
            </>
      )
}

export default BookingListScreen
