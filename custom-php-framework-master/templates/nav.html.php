<?php
/** @var $router \App\Service\Router */

?>
<ul>
    <li><a href="<?= $router->generatePath('post-index') ?>">Posts</a></li>
    <li><a href="<?= $router->generatePath('category-index') ?>">Categories</a></li>
    <li><a href="<?= $router->generatePath('info') ?>">Info</a></li>
</ul>
<?php
