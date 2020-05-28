import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Rating from '@material-ui/lab/Rating';
import Box from '@material-ui/core/Box';

const labels = {
  0: "0",
  0.1: '0.1',
  0.2: '0.2',
  0.3: '0.3',
  0.4: '0.4',
  0.5: '0.5',
  0.6: '0.6',
  0.7: '0.7',
  0.8: '0.8',
  0.9: '0.9',
  1.0: '1',
  1.1: '1.1',
  1.2: '1.2',
  1.3: '1.3',
  1.4: '1.4',
  1.5: '1.5',
  1.6: '1.6',
  1.7: '1.7',
  1.8: '1.8',
  1.9: '1.9',
  2.0: '2',
  2.1: '2.1',
  2.2: '2.2',
  2.3: '2.3',
  2.4: '2.4',
  2.5: '2.5',
  2.6: '2.6',
  2.7: '2.7',
  2.8: '2.8',
  2.9: '2.9',
  3.0: '3',
  3.1: '3.1',
  3.2: '3.2',
  3.3: '3.3',
  3.4: '3.4',
  3.5: '3.5',
  3.6: '3.6',
  3.7: '3.7',
  3.8: '3.8',
  3.9: '3.9',
  4.0: '4',
  4.1: '4.1',
  4.2: '4.2',
  4.3: '4.3',
  4.4: '4.4',
  4.5: '4.5',
  4.6: '4.6',
  4.7: '4.7',
  4.8: '4.8',
  4.9: '4.9',
  5.0: '5',
};

const useStyles = makeStyles({
  root: {
    width: 200,
    display: 'flex',
    alignItems: 'center',
  },
});

export default function HoverRating(props) {
  const [value, setValue] = React.useState(parseFloat(props.state.rating));
  const [hover, setHover] = React.useState(-1);
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Rating
        name="hover-feedback"
        value={value}
        precision={1}
        size="large"
        onChange={(event, newValue) => {
          props.state.sendValue(parseInt(newValue), (rating) => {
            setValue(parseFloat(rating))
          });
        }}
        onChangeActive={(event, newHover) => {
          setHover(newHover);
        }}
      />
      {value !== null && <Box ml={2}>{labels[hover !== -1 ? hover : value]}</Box>}
    </div>
  );
}