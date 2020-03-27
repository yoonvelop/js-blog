import React from 'react';
import styled from "styled-components";
import Button from "./Button";
import Responsive from "./Responsive";
import {Link} from "react-router-dom";

const HeaderBlock = styled.div`
    width : 100%;
    position : fixed;
    background : #fff;
    box-shadow : 0 2px 4px rgba(0,0,0,0.08)
}
`;

const Wrapper = styled(Responsive)`
    height : 4rem;
    display : flex;
    align-items : center;
    justify-content : space-between;
    .logo{
        font-size : 1.125rem;
        font-weight : 800;
        letter-spacing : 2px;
    }
    .right{
        display : flex;
        align-items : center;
    }
`;

/*헤더가 fix 이므로 여백 주는 component*/
const Spacer = styled.div`
       height : 4rem;
}
`;

const Header = () => {
    return (
        <>
            <HeaderBlock>
                <Wrapper>
                    <Link to="/" className="logo">REACTERS</Link>
                    <div className="right">
                        <Button to="/login">로그인</Button>
                    </div>
                </Wrapper>
            </HeaderBlock>
            <Spacer />
        </>
    );
};

export default Header;