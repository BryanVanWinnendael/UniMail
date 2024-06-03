export const metadata = {
  title: 'Login | UniMail',
  description: 'Login to UniMail to keep all your emails at one place',
}

export default function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div>
      {children}
    </div>
  )
}
