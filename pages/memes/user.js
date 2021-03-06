import { Button, IconEdit, IconLoader, IconTrash, Typography } from '@supabase/ui'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import * as R from 'ramda'
import DeleteMemeModal from '../../components/DeleteMemeModal/DeleteMemeModal'
import { getUserMemes, deleteMeme } from '../../utils/supabaseClient'
import { splitIntoColumns } from '../../utils/layout'

const UserMemes = ({ user, onExpandMeme }) => {
  const [loading, setLoading] = useState(true)
  const [loadAnimations, setLoadAnimations] = useState(false)
  const [memes, setMemes] = useState([])
  const [memeToDelete, setMemeToDelete] = useState(null)

  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 500

  useEffect(() => {
    if (user) {
      getMemes()
    }
    setLoadAnimations(true)
  }, [user])

  const getMemes = async () => {
    const columns = isMobile ? 2 : 5
    const userMemes = await getUserMemes(user)
    const formattedMemes = splitIntoColumns(userMemes, columns)
    setMemes(formattedMemes)
    setLoading(false)
  }

  const onSelectDeleteMeme = (meme) => {
    setMemeToDelete(meme)
  }

  const onDeleteMeme = async () => {
    await deleteMeme(memeToDelete)
    await getMemes()
    setMemeToDelete(null)
  }

  const onSelectEditMeme = (meme) => {}

  return !user ? (
    <div
      className="py-10 flex flex-col items-center justify-center space-y-4"
      style={{ height: 'calc(100vh - 64px)' }}
    >
      <div className="relative">
        <img className="w-[300px] sm:w-[400px]" src="/img/you-shall-not-pass.png" />
        <p
          className={`text-white absolute transition delay-500 translate-x-5 sm:translate-x-16 ${
            loadAnimations ? 'opacity-100 -translate-y-14' : 'opacity-0 -translate-y-12'
          }`}
          style={{
            fontFamily: 'Impact',
            fontSize: '2rem',
            WebkitTextStrokeWidth: '2px',
            WebkitTextStrokeColor: '#000000',
          }}
        >
          YOU SHALL NOT PASS
        </p>
      </div>
      <Typography>Log in to view your saved memes or...</Typography>
      <Button>
        <Link href="/">
          <a>Create some memes first!</a>
        </Link>
      </Button>
    </div>
  ) : (
    <>
      <div className="relative px-4 py-10" style={{ height: 'calc(100vh - 64px)' }}>
        <div className="max-w-screen-xl h-full mx-auto flex flex-col space-y-4">
          {loading ? (
            <div className="w-full h-full flex flex-col items-center justify-center space-y-4">
              <Typography>
                <IconLoader className="animate-spin" />
              </Typography>
              <Typography.Text>Loading memes</Typography.Text>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-3 mb-4">
                <div className="hidden sm:block" />
                <div className="flex items-center sm:justify-center col-span-2 sm:col-span-1">
                  <Typography.Title level={3}>Your Saved Memes</Typography.Title>
                </div>
                <div className="flex items-center justify-end">
                  {R.pathOr([], [0], memes).length > 0 && (
                    <Button>
                      <Link href="/">
                        <a>{isMobile ? 'Make memes!' : 'Make more memes!'}</a>
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
              {R.pathOr([], [0], memes).length === 0 && (
                <div className="flex flex-col items-center justify-center h-full space-y-4">
                  <img className="w-[150px]" src="/img/polite-cat.png" />
                  <Typography>You don't have any saved memes yet</Typography>
                  <Button>
                    <Link href="/">
                      <a>Create some memes first!</a>
                    </Link>
                  </Button>
                </div>
              )}
              <div className="overflow-y-auto">
                <div className={`grid ${isMobile ? 'grid-cols-2' : 'grid-cols-5'} gap-6`}>
                  {R.addIndex(R.map)(
                    (content, idx) => (
                      <div key={idx} className="space-y-6">
                        {R.map(
                          (meme) => (
                            <div key={meme.id} className="w-full relative group cursor-pointer">
                              <img
                                className="rounded-md w-full"
                                src={meme.url}
                                onClick={() => onExpandMeme(meme)}
                              />
                              <div className="flex flex-col absolute top-2 right-2 transition opacity-0 group-hover:opacity-100 space-y-2">
                                {/* <div
                              className="w-8 h-8 rounded-md bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-100 cursor-pointer"
                              onClick={() => onSelectEditMeme(meme)}
                            >
                              <IconEdit className="w-4" strokeWidth={2} />
                            </div> */}
                                <div
                                  className="w-8 h-8 rounded-md bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-100 cursor-pointer"
                                  onClick={() => onSelectDeleteMeme(meme)}
                                >
                                  <IconTrash className="w-4" strokeWidth={2} />
                                </div>
                              </div>
                            </div>
                          ),
                          content
                        )}
                      </div>
                    ),
                    memes
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      <DeleteMemeModal
        visible={!R.isNil(memeToDelete)}
        onCancelDelete={() => setMemeToDelete(null)}
        onConfirmDelete={onDeleteMeme}
      />
    </>
  )
}

export default UserMemes
