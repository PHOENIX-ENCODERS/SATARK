// @flow

import React from 'react';
import styled from 'styled-components';

const Div = styled.div`
  padding: 0.5rem;
  display: inline-block;
  min-width: 4.5rem;

  & > label {
    font-size: smaller;
    text-transform: capitalize;
    font-weight: bold;
  }

  &.select {
    padding: 0.25rem 0.5rem;

    @media screen and (min-width: 425px) {
      min-width: 15rem;
    }
  }

  &.crimes, &.buttons {
    width: calc(100% - 1rem);
  }

  &.crimes {
    height: 5.5rem;
    overflow: auto;
    display: inline-flex;
    flex-wrap: wrap;
    align-items: center; 

    @media screen and (min-width: 768px) {
      height: initial;
    }

    .each-crime {
      font-size: small;
      line-height: 1rem;
      vertical-align: middle;
      margin: 0.1rem;

      label {
        font-size: larger;
        font-weight: bolder;
      }

      .color {
        @media screen and (min-width: 768px) {
          width: 0.5rem;
          height: 0.5rem;
          margin: 0 0.2rem;  
        }

        width: 0.75rem;
        height: 0.75rem;
        display: inline-block;
        border-radius: 0.5rem;
        margin: 0 0.3rem;
      }

      button {
        &:focus {
          outline: none;
        }
      }
    }
  }

  &.buttons {
    button {
      width: 100%;
    }
  }
`;

const GridItem = ({ id, className, children }: {
  id?: string | number | null,
  className?: string,
  children: any,
}) => (
  <Div id={id} className={className}>
    { children }
  </Div>
);

GridItem.defaultProps = {
  id: null,
  className: '',
};

export default GridItem;
