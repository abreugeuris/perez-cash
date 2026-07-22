import React from 'react';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';

export default function TooltipProvider({ delayDuration = 0, ...props }) {
  return <TooltipPrimitive.Provider delayDuration={delayDuration} {...props} />;
}