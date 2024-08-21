import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getPosts } from './postSlice'
import PostCard from './PostCard'
import { LoadingButton } from '@mui/lab'
import { Box, Typography } from '@mui/material'

function PostList({ userId }) {
  const [page, setPage] = useState(1)

  const dispatch = useDispatch()
  const { postsById, currentPagePosts, totalPosts, isLoading } = useSelector(state => state.post)
  const posts = currentPagePosts.map((postId) => postsById[postId]);


  useEffect(() => {
    if (userId) dispatch(getPosts({ userId, page }));
    console.log(`ahihi`)
  }, [dispatch, userId, page, totalPosts]);

  return (
    <>
      {posts.map((post) => <PostCard post={post} key={post._id} totalPosts={totalPosts} />)}
      <Box sx={{ display: "flex", justifyContent: "center" }}>

        {totalPosts
          ?
          (<LoadingButton
            variant="outlined"
            size="small"
            loading={isLoading}
            onClick={() => setPage((page) => page + 1)}
            disabled={Boolean(totalPosts) && posts.length >= totalPosts}

          > Load More
          </LoadingButton>)
          :
          (<Typography>No Post Yet</Typography>)}
      </Box>
    </>
  )
}

export default PostList
