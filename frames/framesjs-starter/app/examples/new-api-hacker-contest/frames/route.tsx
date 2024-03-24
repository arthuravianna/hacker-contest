/* eslint-disable react/jsx-key */
import { createFrames, Button } from "frames.js/next";

enum STATE {
  INITIAL,
  TITLE,
  DESCRIPTION,
  TESTS,
  SOURCE_CODE
}

interface Test {
  in:string|Object,
  out:string|Object
}

interface Contest {
  title:string,
  description:string,
  tests:Array<Test>
}

const frames = createFrames({
  basePath: "/examples/new-api-hacker-contest/frames",
});

// STATE === INITIAL
const initialFrame:any = {
  image: (
    <span>
      Welcome to the Hacker Contest! What do you want to do?
    </span>
  ),
  buttons: [
    <Button action="post" target={{ query: { state: "Yes" }}}>
      {/* Show Slow request frame (it needs to fetch the list of contests) */}
      Participate in a Contest
    </Button>,
    <Button action="post" target={{ query: { state: STATE.TITLE }}}>
      Create a Contest
    </Button>,
  ]
}

// STATE === TITLE
const titleFrame:any = {
  image: (<span>Choose a title for your Hacker Contest.</span>),
  buttons: [
    <Button action="post" target={{query: {state: STATE.DESCRIPTION}}}>Next</Button>
  ],
  textInput: "Title"
}

// STATE === DESCRIPTION
const descriptionFrame = (contest:Contest) => {
  return {
    image: (<span>Choose a description for "{contest.title}"</span>),
    buttons: [
      <Button action="post" target={{query: {state: STATE.TITLE}}}>Previous</Button>,
      <Button action="post" target={{query: {state: STATE.TESTS, title: contest.title}}}>Next</Button>
    ],
    textInput: "Description"
  }
}

// STATE === TESTS
const testsFrame = (contest:Contest) => {
  return {
    image: (
      <div tw="flex flex-wrap justify-center">
        <div>Provide the tests for the Contest, use the following format:</div>
        <div>{JSON.stringify([{"in": "input0", "out": "output0"},{"in": "input1", "out": "output1"}])}</div>
      </div>
    ),
    buttons: [
      <Button action="post" target={{query: {state: STATE.DESCRIPTION, title: contest.title}}}>Previous</Button>,
      <Button action="post"
        target={{query: {state: STATE.DESCRIPTION, title: contest.title, description: contest.description}}}>
          Next
      </Button>
    ],
    textInput: "Tests"
  }
}

const handleRequest = frames(async (ctx) => {
  console.log(ctx.searchParams)

  let state;
  if (!ctx.searchParams.state) {
    state = STATE.INITIAL;
  } else {
    state = parseInt(ctx.searchParams.state);  
  }

  try {
    let contest:Contest = {
      title: ctx.searchParams.title? ctx.searchParams.title:"",
      description: ctx.searchParams.description? ctx.searchParams.description:"",
      tests: ctx.searchParams.tests? JSON.parse(ctx.searchParams.tests) as Array<Test>: []
    };
    
    if (state === STATE.INITIAL) {
      return initialFrame;
    } else if (state === STATE.TITLE) {
      return titleFrame;
    } else if (state === STATE.DESCRIPTION) {
      if (ctx.message) contest.title = ctx.message.inputText;
      return descriptionFrame(contest);
    } else if (state === STATE.TESTS) {
      if (ctx.message) contest.description = ctx.message.inputText;
      return testsFrame(contest);
    } else {
      return {
        image: <span>Unknow State.</span>
      }
    }
      
  } catch (error) {
    return {
      image: <span>Ooops... Something went wrong.</span>
    }
  }

});

export const GET = handleRequest;
export const POST = handleRequest;