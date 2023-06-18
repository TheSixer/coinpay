import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import TabPanel from '@mui/lab/TabPanel';
import TabContext from '@mui/lab/TabContext';
import Found from './Found';
import Withdraw from './Withdraw';

export default function ColorTabs() {
  const [value, setValue] = React.useState('one');

  const handleChange = (_: any, newValue: React.SetStateAction<string>) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <TabContext value={value}>
        <Box sx={{ width: '100%' }}>
          <Tabs
            value={value}
            onChange={handleChange}
            textColor="secondary"
            indicatorColor="secondary"
            aria-label="secondary tabs example"
          >
            <Tab value="one" label="入金记录" />
            <Tab value="two" label="出金记录" />
          </Tabs>
        </Box>
        <TabPanel value="one">
          <Found />
        </TabPanel>
        <TabPanel value="two">
          <Withdraw />
        </TabPanel>
      </TabContext>
    </Box>
  );
}
