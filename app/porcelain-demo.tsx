export default function Demo() {
  console.warn('warn from demo');
  const val = undefined || 'fallback';
  return <div>{val}</div>;
}
