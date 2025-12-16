import { forwardRef } from "react"

const Container = forwardRef((props: any = {}, ref: any) => {
  return (
    <div
      style={{
        width: '100%',
        display: 'flex',
        gap: '10px',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'var(--color-neutral)',
        color: 'var(--color-base-300)',
        padding: '20px 100px',
        ...props.style
      }}
      ref={ref}
      className={props.className}
    >
      {props.children}
    </div>
  )
})

function Header({ children }: any) {
  return (
    <h1 className="text-4xl font-bold">
      {children}
    </h1>
  )
}

const Content = forwardRef((props: any = {}, ref: any) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: '10px',
        justifyContent: 'center',
        width: '100%',
        ...props.style
      }}
      ref={ref}
    >
      {props.children}
    </div>
  )
})

export const HomeSectionLayout = {
  Container,
  Header,
  Content
}
