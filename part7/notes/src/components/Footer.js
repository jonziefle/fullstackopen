import styled from 'styled-components'

const StyledFooter = styled.footer`
  background: Chocolate;
  padding: 1em;
  margin-top: 1em;
`

const Footer = () => (
    <StyledFooter>
        <em>Note app, Department of Computer Science 2022</em>
    </StyledFooter>
)

export default Footer