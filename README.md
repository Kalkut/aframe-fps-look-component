## aframe-fps-look-component

A component for [A-Frame](https://aframe.io) VR that facilitates controlling entity rotation directly with captured mouse. Includes Core HMD Controls, so can be used as a drop in replacement to look-controls component.

## Usage

Install.

```bash
npm install aframe-fps-look-component
```

Register.

```js
AFrame = require('aframe-core');
AFrame.registerComponent('fps-look-controls', require('aframe-fps-look-component').component);
```

Use.

```html
<a-scene>
  <a-entity camera fps-look-controls></a-entity>
</a-scene>
```

## Properties

| Property | Description | Default Value |
| -------- | ----------- | ------------- |
| enabled |             | true              |
| sensitivity |             | 1              |
