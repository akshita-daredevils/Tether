import { Panel } from '../../components/Panel'
import { TextInput } from '../../components/TextInput'
import { Button } from '../../components/Button'
import { useAuth } from '../../hooks/useAuth.ts'
import { useChat } from '../../hooks/useChat'
import { useChatComposer } from '../../hooks/useChatComposer'

type ChatPanelProps = {
  roomId: string
}

export const ChatPanel = ({ roomId }: ChatPanelProps) => {
  const { user } = useAuth()
  const { messages, loading, sendMessage } = useChat(roomId)
  const { text, setText, submit, typingLabel } = useChatComposer(roomId, sendMessage)

  return (
    <Panel title="Chat" description="Real-time messages for just the two of you." className="neo-card">
      <div className="flex flex-col gap-4">
        <div className="max-h-[320px] space-y-3 overflow-y-auto rounded-xl border border-white/10 bg-black/20 p-4">
          {loading ? <p className="text-xs text-white/50">Loading messages...</p> : null}
          {messages.map((message) => {
            const isSelf = message.senderId === user?.uid
            const timestamp = message.createdAt?.toDate().toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })
            return (
              <div
                key={message.id}
                className={`flex ${isSelf ? 'justify-end text-right' : 'justify-start text-left'}`}
              >
                <div
                  className={`max-w-[80%] rounded-xl border px-3 py-2 text-sm ${
                    isSelf
                      ? 'border-accent/40 bg-accent/20 text-white'
                      : 'border-white/15 bg-white/5 text-white/90'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{message.text}</p>
                  {timestamp ? (
                    <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-white/40">
                      {timestamp}
                    </p>
                  ) : null}
                </div>
              </div>
            )
          })}
          {messages.length === 0 && !loading ? (
            <p className="text-xs text-white/40">No messages yet. Start the conversation.</p>
          ) : null}
        </div>
        <div className="grid gap-2">
          {typingLabel ? <p className="text-xs text-accent">{typingLabel}</p> : null}
          <div className="flex items-center gap-2">
            <TextInput
              placeholder="Write a message..."
              value={text}
              onChange={(event) => setText(event.target.value)}
            />
            <Button onClick={submit}>Send</Button>
          </div>
        </div>
      </div>
    </Panel>
  )
}
