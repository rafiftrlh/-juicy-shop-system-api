import supabase from "./supabase_client"

const TABLES_TO_WATCH = [
  'system_users',
  'members',
  'categories',
  'inventory',
  'inventory_logs',
  'juices',
  'member_topup_logs',
  'order_items',
  'order_transaction_logs',
  'orders'
]

function setupWebSocket(io) {
  io.on('connection', (socket) => {
    console.log('A user connected')

    const channel = supabase.channel('db-changes')

    TABLES_TO_WATCH.forEach(table => {
      channel.on(
        'postgres_changes',
        { event: '*', schema: 'public', table: table },
        (payload) => {
          console.log(`Change received in ${table}!`, payload)
          socket.emit(`${table}Change`, payload)
        }
      )
    })

    channel
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log('Successfully subscribed to database changes')
        }
      })

    socket.on('disconnect', () => {
      console.log('User disconnected')
      channel.unsubscribe()
    })
  })
}

export default setupWebSocket