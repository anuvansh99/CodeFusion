import React from 'react'
import Navbar from '../components/Navbar'

const About = () => {
  return (
    <div>
        <Navbar/>
        <header class="header">
    <h1 class="title">About CodeFusion</h1>
  </header>
  <main class="main-content">
    <section class="introduction">
      <h2 class="section-title">Introduction</h2>
      <p class="text">
        CodeFusion is a robust platform for creating, editing, and testing HTML, CSS, and JavaScript projects. 
        Designed with developers in mind, it offers a seamless coding experience with live preview capabilities.
      </p>
    </section>
    <section class="features">
      <h2 class="section-title">Features</h2>
      <ul class="feature-list">
        <li class="feature-item">Syntax Highlighting</li>
        <li class="feature-item">Real-Time Preview</li>
        <li class="feature-item">Light/Dark Theme Toggle</li>
        <li class="feature-item">Project Save and Load</li>
        <li class="feature-item">User-Friendly Interface</li>
      </ul>
    </section>
    <section class="vision">
      <h2 class="section-title">Our Vision</h2>
      <p class="text">
        Our goal is to empower developers and learners by providing a versatile and accessible coding environment. 
        Whether you're prototyping ideas or teaching coding, this IDE is here to simplify the process.
      </p>
    </section>
  </main>
  <footer class="footer">
    <p class="footer-text">© 2024 CodeFusion. All rights reserved.</p>
  </footer>
    </div>
  )
}

export default About