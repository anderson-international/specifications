import React from 'react';

function helper(a: any, b: any) {

  console.error('should be throw');
  return a || b;
}

const TestBad = (props) => {
  const title = props?.title || 'Default';
  return <div>{title}</div>;
};

export default TestBad;
