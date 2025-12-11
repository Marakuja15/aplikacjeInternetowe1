<?php
/** @var $category \App\Model\Category */
?>

<div class="form-group">
    <label for="name">Name</label>
    <input type="text" id="name" name="category[name]" value="<?= $category->getName() ?>">
</div>

<div class="form-group">
    <label for="description">Description</label>
    <textarea id="description" name="category[description]"><?= $category->getDescription() ?></textarea>
</div>
