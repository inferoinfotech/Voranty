import React from 'react';
import styled from 'styled-components';
import { keyframes } from 'styled-components';

const CustomButton = ({ onClick, children, type = "button", status = false }) => {
  return (
    <StyledWrapper disabled={status}>
      <button type={type} className="button" onClick={onClick} disabled={status}>
        <span className="text">{children}</span>
        <svg className="icon" viewBox="0 0 24 24" fill="currentColor">
          <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm4.28 10.28a.75.75 0 000-1.06l-3-3a.75.75 0 10-1.06 1.06l1.72 1.72H8.25a.75.75 0 000 1.5h5.69l-1.72 1.72a.75.75 0 101.06 1.06l3-3z" clipRule="evenodd" />
        </svg>
      </button>
    </StyledWrapper>
  );
}

const bounce = keyframes`
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-5px);
  }
  60% {
    transform: translateY(-3px);
  }
`;

const StyledWrapper = styled.div`
  .button {
    position: relative;
    transition: all 0.3s ease-in-out;
    box-shadow: ${({ disabled }) => (disabled ? 'none' : '0px 5px 10px rgba(0, 0, 0, 0.2)')};
    padding-block: 0.5rem;
    padding-inline: 1.25rem;
    background-color: ${({ disabled }) => (disabled ? '#ccc' : '#37B5FF')};
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #ffff;
    gap: 10px;
    font-weight: bold;
    border: 3px solid #ffffff4d;
    outline: none;
    overflow: hidden;
    font-size: 15px;
    cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
    width: 100%;
    height: 48px;
  }

  .icon {
    width: 24px;
    height: 24px;
    transition: all 0.3s ease-in-out;
  }

  .button:hover {
    transform: ${({ disabled }) => (disabled ? 'none' : 'scale(1.02)')};
    border-color: ${({ disabled }) => (disabled ? '#ccc' : '#fff9')};
  }

  .button:hover .icon {
    transform: ${({ disabled }) => (disabled ? 'none' : 'translate(4px)')};
  }

  .button:hover::before {
    animation: ${({ disabled }) => (disabled ? 'none' : 'shine 1.5s ease-out infinite')};
  }

  .button::before {
    content: "";
    position: absolute;
    width: 100px;
    height: 100%;
    background-image: linear-gradient(
      120deg,
      rgba(255, 255, 255, 0) 30%,
      rgba(255, 255, 255, 0.8),
      rgba(255, 255, 255, 0) 70%
    );
    top: 0;
    left: -100px;
    opacity: 0.6;
  }

  .button:active {
    box-shadow: none;
    transform: ${({ disabled }) => (disabled ? 'none' : 'scale(0.95)')};
  }

  @keyframes shine {
    0% {
      left: -100px;
    }

    60% {
      left: 100%;
    }

    to {
      left: 100%;
    }
  }
`;

export default CustomButton;